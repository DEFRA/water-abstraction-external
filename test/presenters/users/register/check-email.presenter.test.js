// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CheckEmailPresenter from '../../../../src/presenters/users/register/check-email.presenter.js'

describe('Users - Register - Check Email presenter', () => {
  let session

  beforeEach(() => {
    session = { email: 'licences@bigfarm.co.uk', id: generateUUID() }
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = CheckEmailPresenter(session)

      expect(result).toEqual({
        email: 'licences@bigfarm.co.uk',
        pageTitle: 'Confirm your email address',
        sendAgainLink: '/send-again'
      })
    })
  })
})
