// Test framework
import { describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import SubmitCheckService from '../../../../src/services/users/register/submit-check.service.js'

describe('Users - Register - Submit Check service', () => {
  describe('when called', () => {
    it('returns the URL for the check email page', () => {
      const sessionId = generateUUID()

      const result = SubmitCheckService(sessionId)

      expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/check-email` })
    })
  })
})
