// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import NotificationModel from 'water-abstraction-engine/models/notification.model.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'
import { generateExternalEmailAddress, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CreateResetPasswordNotificationDal from '../../../src/dal/users/create-reset-password-notification.dal.js'

const { domains } = ServerConfig

describe('Users - Create Reset Password Notification DAL', () => {
  let email
  let resetGuid

  describe('when called', () => {
    beforeEach(() => {
      email = generateExternalEmailAddress()
      resetGuid = generateUUID()
    })

    it('creates a notification', async () => {
      const result = await CreateResetPasswordNotificationDal(email, resetGuid)

      const notification = await NotificationModel.query().findById(result.id)

      expect(notification.messageRef).toEqual('existing_user_verification_email')
      expect(notification.messageType).toEqual('email')
      expect(notification.personalisation).toEqual({
        link: `${domains.external}/signin`,
        resetLink: `${domains.external}/reset_password_change_password?resetGuid=${resetGuid}`
      })
      expect(notification.recipient).toEqual(email)
    })
  })
})
