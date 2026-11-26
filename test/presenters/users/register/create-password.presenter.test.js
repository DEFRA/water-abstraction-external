// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Thing under test
import CreatePasswordPresenter from '../../../../src/presenters/users/register/create-password.presenter.js'

describe('Users - Register - Create Password presenter', () => {
  let session

  describe('when called', () => {
    beforeEach(() => {
      session = SessionModelStub({})
    })

    it('returns page data for the view', () => {
      const result = CreatePasswordPresenter(session)

      expect(result).toEqual({
        confirmPassword: null,
        pageTitle: 'Create a password',
        password: null
      })
    })
  })

  describe('when the passwords have been entered', () => {
    beforeEach(() => {
      session = SessionModelStub({})

      session.confirmPassword = 'Password2!'
      session.password = 'Password1!'
    })

    it('returns the passwords entered', () => {
      const result = CreatePasswordPresenter(session)

      expect(result).toEqual({
        confirmPassword: 'Password2!',
        pageTitle: 'Create a password',
        password: 'Password1!'
      })
    })
  })
})
