// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import GlobalNotifierStub from 'water-abstraction-engine/test/stubs/global-notifier.stub.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'

// Things we need to stub
import * as CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'

// Thing under test
import SendVerificationEmailService from '../../../../src/services/users/register/send-verification-email.service.js'

describe('Users - Register - Send Verification Email service', () => {
  const email = 'new.user@example.com'
  const resetGuid = '6e7a6b97-f5c4-4c30-965e-ee67ee6d9f25'

  let createEmailRequestStub
  let notifierStub

  beforeEach(() => {
    vi.replaceProperty(ServerConfig.domains, 'external', 'https://external.com')

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
      createEmailRequestStub = vi.spyOn(CreateEmailRequest, 'default').mockResolvedValue({ succeeded: true })
    })

    it('sends the email with the create password link', async () => {
      await SendVerificationEmailService(email, resetGuid)

      expect(createEmailRequestStub).toHaveBeenCalledWith('3d25b496-abbd-49bb-b943-016019082988', email, {
        personalisation: {
          link: `https://external.com/create-password?resetGuid=${resetGuid}`
        }
      })
    })

    it('does not log an error', async () => {
      await SendVerificationEmailService(email, resetGuid)

      expect(notifierStub.omfg).not.toHaveBeenCalled()
    })
  })

  describe('when the request to Notify fails', () => {
    beforeEach(() => {
      vi.spyOn(CreateEmailRequest, 'default').mockResolvedValue({ succeeded: false })
    })

    it('logs the error', async () => {
      await SendVerificationEmailService(email, resetGuid)

      expect(notifierStub.omfg).toHaveBeenCalledWith(
        'Failed when trying to send external user verification email',
        { email },
        expect.any(Error)
      )
    })
  })

  describe('when the request to Notify throws an error', () => {
    beforeEach(() => {
      vi.spyOn(CreateEmailRequest, 'default').mockRejectedValue(new Error('Boom'))
    })

    it('logs the error', async () => {
      await SendVerificationEmailService(email, resetGuid)

      expect(notifierStub.omfg).toHaveBeenCalledWith(
        'Failed when trying to send external user verification email',
        { email },
        expect.any(Error)
      )
    })
  })
})
