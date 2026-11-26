// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import SubmitCreatePasswordService from '../../../../src/services/users/register/submit-create-password.service.js'

describe('Users - Register - Submit Create Password service', () => {
  let sessionId

  beforeEach(() => {
    sessionId = generateUUID()
  })

  describe('when called', () => {
    it('returns the redirect URL to the account created page', () => {
      const result = SubmitCreatePasswordService(sessionId)

      expect(result).toEqual({
        redirectUrl: `/ext/users/register/${sessionId}/account-created`
      })
    })
  })
})
