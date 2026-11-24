// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import EmailPresenter from '../../../../src/presenters/users/register/email.presenter.js'

describe('Users - Register - Email presenter', () => {
  let session

  beforeEach(() => {
    session = { id: generateUUID() }
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = EmailPresenter(session)

      expect(result).toEqual({
        backLink: {
          href: '/ext/users/register',
          text: 'Back'
        },
        email: null,
        pageTitle: 'Create an account'
      })
    })
  })

  describe('the "email" property', () => {
    describe('when an email address has been saved', () => {
      beforeEach(() => {
        session.email = 'Licences@BigFarm.co.uk'
      })

      it('returns the email address in lowercase', () => {
        const result = EmailPresenter(session)

        expect(result.email).toEqual('licences@bigfarm.co.uk')
      })
    })
  })
})
