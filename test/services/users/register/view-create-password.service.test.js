// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import ViewCreatePasswordService from '../../../../src/services/users/register/view-create-password.service.js'

describe('Users - Register - View Create Password service', () => {
  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = ViewCreatePasswordService()

      expect(result).toEqual({
        pageTitle: 'Create a password'
      })
    })
  })
})
