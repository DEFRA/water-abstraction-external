// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import RegisterPresenter from '../../../src/presenters/users/register.presenter.js'

describe('User - Register Presenter', () => {
  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = RegisterPresenter()

      expect(result).toEqual({
        backLink: {
          href: '/welcome',
          text: 'Back'
        },
        pageTitle: 'Create an account to manage your water abstraction licence online'
      })
    })
  })
})
