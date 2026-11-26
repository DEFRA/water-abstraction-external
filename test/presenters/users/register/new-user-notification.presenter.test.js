// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import ServerConfig from 'water-abstraction-engine/config/server.config.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import NewUserNotificationPresenter from '../../../../src/presenters/users/register/new-user-notification.presenter.js'

const { domains } = ServerConfig

describe('Users - Register - New User Notification presenter', () => {
  const email = 'licences@bigfarm.co.uk'

  let resetGuid

  beforeEach(() => {
    resetGuid = generateUUID()
  })

  describe('when called', () => {
    it('returns the data needed to create the notification', () => {
      const result = NewUserNotificationPresenter(email, resetGuid)

      expect(result).toEqual({
        messageRef: 'new_user_verification_email',
        messageType: 'email',
        personalisation: {
          link: `${domains.external}/ext/users/register/setup/create-password/${resetGuid}`
        },
        recipient: email
      })
    })
  })
})
