// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import ServerConfig from 'water-abstraction-engine/config/server.config.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as CreateNotificationDal from '../../../../src/dal/notifications/create-notification.dal.js'
import * as CreateUserDal from '../../../../src/dal/users/create-user.dal.js'
import * as FetchUserByEmailDal from '../../../../src/dal/users/fetch-user-by-email.dal.js'
import * as SendResetPasswordEmailService from '../../../../src/services/users/register/send-reset-password-email.service.js'
import * as SendVerificationEmailService from '../../../../src/services/users/register/send-verification-email.service.js'
import * as UpdateResetGuidDal from '../../../../src/dal/users/update-reset-guid.dal.js'

// Thing under test
import CreateAccountService from '../../../../src/services/users/register/create-account.service.js'

const { domains } = ServerConfig

describe('Users - Register - Create Account service', () => {
  const email = 'licences@bigfarm.co.uk'

  let createNotificationStub
  let createUserStub
  let fetchUserByEmailStub
  let notification
  let resetGuid
  let sendResetPasswordEmailStub
  let sendVerificationEmailStub
  let updateResetGuidStub

  beforeEach(() => {
    notification = { id: generateUUID() }
    resetGuid = generateUUID()

    createNotificationStub = vi.spyOn(CreateNotificationDal, 'default').mockResolvedValue(notification)
    createUserStub = vi.spyOn(CreateUserDal, 'default').mockResolvedValue({ resetGuid })
    fetchUserByEmailStub = vi.spyOn(FetchUserByEmailDal, 'default').mockResolvedValue(undefined)
    updateResetGuidStub = vi.spyOn(UpdateResetGuidDal, 'default').mockResolvedValue(resetGuid)
    sendResetPasswordEmailStub = vi.spyOn(SendResetPasswordEmailService, 'default').mockResolvedValue()
    sendVerificationEmailStub = vi.spyOn(SendVerificationEmailService, 'default').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when no account exists for the email address', () => {
    it('looks up the user by the email address', async () => {
      await CreateAccountService(email)

      expect(fetchUserByEmailStub).toHaveBeenCalledWith(email)
    })

    it('creates the user', async () => {
      await CreateAccountService(email)

      expect(createUserStub).toHaveBeenCalledWith(email)
    })

    it('creates the new user notification and sends the verification email', async () => {
      await CreateAccountService(email)

      expect(createNotificationStub).toHaveBeenCalledWith({
        messageRef: 'new_user_verification_email',
        messageType: 'email',
        personalisation: {
          link: `${domains.external}/ext/users/register/setup/create-password/${resetGuid}`
        },
        recipient: email
      })
      expect(sendVerificationEmailStub).toHaveBeenCalledWith(notification)
      expect(sendResetPasswordEmailStub).not.toHaveBeenCalled()
    })
  })

  describe('when a disabled account already exists for the email address', () => {
    beforeEach(() => {
      fetchUserByEmailStub.mockResolvedValue({ enabled: false, id: 123 })
    })

    it('does not create the user, create a notification or send an email', async () => {
      await CreateAccountService(email)

      expect(createUserStub).not.toHaveBeenCalled()
      expect(updateResetGuidStub).not.toHaveBeenCalled()
      expect(createNotificationStub).not.toHaveBeenCalled()
      expect(sendResetPasswordEmailStub).not.toHaveBeenCalled()
      expect(sendVerificationEmailStub).not.toHaveBeenCalled()
    })
  })

  describe('when an account already exists for the email address', () => {
    beforeEach(() => {
      fetchUserByEmailStub.mockResolvedValue({ enabled: true, id: 123 })
    })

    it('does not create the user', async () => {
      await CreateAccountService(email)

      expect(createUserStub).not.toHaveBeenCalled()
    })

    it('sets a new reset GUID, creates the existing user notification and sends the reset password email', async () => {
      await CreateAccountService(email)

      expect(updateResetGuidStub).toHaveBeenCalledWith(123)
      expect(createNotificationStub).toHaveBeenCalledWith({
        messageRef: 'existing_user_verification_email',
        messageType: 'email',
        personalisation: {
          link: `${domains.external}/signin`,
          resetLink: `${domains.external}/reset_password_change_password?resetGuid=${resetGuid}`
        },
        recipient: email
      })
      expect(sendResetPasswordEmailStub).toHaveBeenCalledWith(notification)
      expect(sendVerificationEmailStub).not.toHaveBeenCalled()
    })
  })
})
