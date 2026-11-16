// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import ViewRegisterService from '../../../src/services/user/view-register.service.js'

describe('User - View Register Service', () => {
  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = ViewRegisterService()

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
