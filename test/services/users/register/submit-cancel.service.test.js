// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as DeleteSessionDal from 'water-abstraction-engine/dal/delete-session.dal.js'

// Thing under test
import SubmitCancelService from '../../../../src/services/users/register/submit-cancel.service.js'

describe('Users - Register - Submit Cancel service', () => {
  let sessionId

  beforeEach(() => {
    sessionId = generateUUID()

    vi.spyOn(DeleteSessionDal, 'default').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns the URL for the welcome page', async () => {
      const result = await SubmitCancelService(sessionId)

      expect(result).toEqual({ redirectUrl: '/welcome' })
    })

    it('deletes the session', async () => {
      await SubmitCancelService(sessionId)

      expect(DeleteSessionDal.default).toHaveBeenCalledWith(sessionId)
    })
  })
})
