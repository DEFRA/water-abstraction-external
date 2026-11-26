// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import CreatePasswordPresenter from '../../../../src/presenters/users/register/create-password.presenter.js'

describe('Users - Register - Create Password presenter', () => {
  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = CreatePasswordPresenter()

      expect(result).toEqual({
        pageTitle: 'Create a password'
      })
    })
  })
})
