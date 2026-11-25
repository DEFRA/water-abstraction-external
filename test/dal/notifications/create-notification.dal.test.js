// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import NotificationModel from 'water-abstraction-engine/models/notification.model.js'
import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CreateNotificationDal from '../../../src/dal/notifications/create-notification.dal.js'

describe('Notifications - Create Notification DAL', () => {
  let notificationData

  beforeEach(() => {
    notificationData = {
      messageRef: 'new_user_verification_email',
      messageType: 'email',
      personalisation: { link: 'https://example.com/create-password' },
      recipient: generateExternalEmailAddress()
    }
  })

  describe('when called', () => {
    it('creates the notification and returns it', async () => {
      const result = await CreateNotificationDal(notificationData)

      const notification = await NotificationModel.query().findById(result.id)

      expect(result.id).toEqual(expect.any(String))
      expect(notification.messageRef).toEqual('new_user_verification_email')
      expect(notification.messageType).toEqual('email')
      expect(notification.personalisation).toEqual({ link: 'https://example.com/create-password' })
      expect(notification.recipient).toEqual(notificationData.recipient)
    })
  })
})
