// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import GlobalNotifierStub from 'water-abstraction-engine/test/stubs/global-notifier.stub.js'

// Things we need to stub
import * as CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'
import * as UpdateNotificationDal from 'water-abstraction-engine/dal/notifications/update-notification.dal.js'

// Thing under test
import SendVerificationEmailService from '../../../../src/services/users/register/send-verification-email.service.js'

describe('Users - Register - Send Verification Email service', () => {
  let createEmailRequestStub
  let notification
  let notifierStub
  let updateNotificationStub

  beforeEach(() => {
    notification = {
      id: '0ac6a6d5-a0ea-4b46-8b3b-1d9b04d4e8a9',
      messageRef: 'new_user_verification_email',
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
            id: 'a8023182-5cb3-4ee3-b777-2fb82cde7fc5'
          },
          statusCode: 201
        },
        succeeded: true
      })
    })

    it('sends the email using the notification recipient and personalisation', async () => {
      await SendVerificationEmailService(notification)

      expect(createEmailRequestStub).toHaveBeenCalledWith(
        '3d25b496-abbd-49bb-b943-016019082988',
        'new.user@example.com',
        {
          personalisation: { link: 'https://external.com/link' }
        }
      )
    })

    it('records the result against the notification', async () => {
      await SendVerificationEmailService(notification)

      expect(updateNotificationStub).toHaveBeenCalledWith(notification, {
        notifyId: 'a8023182-5cb3-4ee3-b777-2fb82cde7fc5',
        notifyStatus: 'created',
        plaintext: 'The email text',
        status: 'pending'
      })
    })

    it('does not log an error', async () => {
      await SendVerificationEmailService(notification)

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
      await SendVerificationEmailService(notification)

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
      await SendVerificationEmailService(notification)

      expect(notifierStub.omfg).toHaveBeenCalledWith(
        'Failed when trying to send external user verification email',
        { notification },
        expect.any(Error)
      )
    })
  })
})
