// Test framework
import { describe, expect, it } from 'vitest'

// Test helpers
import SessionModel from 'water-abstraction-engine/models/session.model.js'

// Thing under test
import InitiateSessionService from '../../../../src/services/users/register/initiate-session.service.js'

describe('Users - Register - Initiate Session service', () => {
  describe('when called', () => {
    it('creates a new, empty session record', async () => {
      const result = await InitiateSessionService()

      const matchingSession = await SessionModel.query().findById(result.id)

      expect(matchingSession).toEqual({
        createdAt: matchingSession.createdAt,
        data: {},
        id: result.id,
        updatedAt: matchingSession.updatedAt
      })
    })
  })
})
