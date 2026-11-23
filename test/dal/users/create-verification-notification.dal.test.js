// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import NotificationModel from 'water-abstraction-engine/models/notification.model.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'
import { generateExternalEmailAddress, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CreateVerificationNotificationDal from '../../../src/dal/users/create-verification-notification.dal.js'

const { domains } = ServerConfig

describe('Users - Create Verification Notification DAL', () => {
  let email
  let resetGuid

  describe('when called', () => {
    beforeEach(() => {
      email = generateExternalEmailAddress()
      resetGuid = generateUUID()
    })

    it('creates a notification', async () => {
      const result = await CreateVerificationNotificationDal(email, resetGuid)

      const notification = await NotificationModel.query().findById(result.id)

      expect(notification.messageRef).toEqual('new_user_verification_email')
      expect(notification.messageType).toEqual('email')
      expect(notification.personalisation).toEqual({
        link: `${domains.external}/create-password?resetGuid=${resetGuid}`
      })
      expect(notification.recipient).toEqual(email)
    })
  })
})
