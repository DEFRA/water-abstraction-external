// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import ServerConfig from 'water-abstraction-engine/config/server.config.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import ExistingUserNotificationPresenter from '../../../../src/presenters/users/register/existing-user-notification.presenter.js'

const { domains } = ServerConfig

describe('Users - Register - Existing User Notification presenter', () => {
  const email = 'licences@bigfarm.co.uk'

  let resetGuid

  beforeEach(() => {
    resetGuid = generateUUID()
  })

  describe('when called', () => {
    it('returns the data needed to create the notification', () => {
      const result = ExistingUserNotificationPresenter(email, resetGuid)

      expect(result).toEqual({
        messageRef: 'existing_user_verification_email',
        messageType: 'email',
        personalisation: {
          link: `${domains.external}/signin`,
          resetLink: `${domains.external}/reset_password_change_password?resetGuid=${resetGuid}`
        },
        recipient: email
      })
    })
  })
})
