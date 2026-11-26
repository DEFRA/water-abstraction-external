// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import GlobalNotifierStub from 'water-abstraction-engine/test/stubs/global-notifier.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'
import * as UpdateNotificationDal from 'water-abstraction-engine/dal/notifications/update-notification.dal.js'

// Thing under test
import SendResetPasswordEmailService from '../../../../src/services/users/register/send-reset-password-email.service.js'

describe('Users - Register - Send Reset Password Email service', () => {
  let createEmailRequestStub
  let notification
  let notifierStub
  let notifyId
  let updateNotificationStub

  beforeEach(() => {
    notifyId = generateUUID()

    notification = {
      id: generateUUID(),
      messageRef: 'existing_user_verification_email',
      messageType: 'email',
      personalisation: { link: 'https://external.com/link' },
      recipient: 'new.user@example.com'
    }

    updateNotificationStub = vi.spyOn(UpdateNotificationDal, 'default').mockResolvedValue()

    // The service depends on GlobalNotifier to have been set. This happens in the GlobalNotifierPlugin when the app
    // starts up. As we're not creating an instance of Hapi server in this test we set it directly with our own stub
    notifierStub = GlobalNotifierStub()
    globalThis.GlobalNotifier = notifierStub
  })

  afterEach(() => {
    vi.restoreAllMocks()
    delete globalThis.GlobalNotifier
  })

  describe('when the email is sent to Notify successfully', () => {
    beforeEach(() => {
      createEmailRequestStub = vi.spyOn(CreateEmailRequest, 'default').mockResolvedValue({
        response: {
          body: {
            content: { body: 'The email text' },
            id: notifyId
          },
          statusCode: 201
        },
        succeeded: true
      })
    })

    it('sends the email using the notification recipient and personalisation', async () => {
      await SendResetPasswordEmailService(notification)

      expect(createEmailRequestStub).toHaveBeenCalledWith(
        'd9654596-a533-47e9-aa27-2cf869c6aa13',
        'new.user@example.com',
        {
          personalisation: { link: 'https://external.com/link' }
        }
      )
    })

    it('records the result against the notification', async () => {
      await SendResetPasswordEmailService(notification)

      expect(updateNotificationStub).toHaveBeenCalledWith(notification, {
        notifyId,
        notifyStatus: 'created',
        plaintext: 'The email text',
        status: 'pending'
      })
    })

    it('does not log an error', async () => {
      await SendResetPasswordEmailService(notification)

      expect(notifierStub.omfg).not.toHaveBeenCalled()
    })
  })

  describe('when the request to Notify fails', () => {
    beforeEach(() => {
      vi.spyOn(CreateEmailRequest, 'default').mockResolvedValue({
        response: {
          body: { errors: [{ error: 'BadRequestError', message: 'Missing personalisation: link' }] },
          statusCode: 400
        },
        succeeded: false
      })
    })

    it('records the error against the notification', async () => {
      await SendResetPasswordEmailService(notification)

      expect(updateNotificationStub).toHaveBeenCalledWith(notification, {
        notifyError:
          '{"errors":[{"error":"BadRequestError","message":"Missing personalisation: link"}],"message":"Request failed with status code 400","status":400}',
        status: 'error'
      })
    })
  })

  describe('when the request to Notify throws an error', () => {
    beforeEach(() => {
      vi.spyOn(CreateEmailRequest, 'default').mockRejectedValue(new Error('Boom'))
    })

    it('logs the error', async () => {
      await SendResetPasswordEmailService(notification)

      expect(notifierStub.omfg).toHaveBeenCalledWith(
        'Failed when trying to send external user reset password email',
        { notification },
        expect.any(Error)
      )
    })
  })
})
