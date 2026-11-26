// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'
import * as FetchUserByResetGuidDal from '../../../../src/dal/users/fetch-user-by-reset-guid.dal.js'

// Thing under test
import InitiateCreatePasswordSessionService from '../../../../src/services/users/register/initiate-create-password-session.service.js'

describe('Users - Register - Initiate Create Password Session service', () => {
  let resetGuid
  let sessionId

  beforeEach(() => {
    resetGuid = generateUUID()
    sessionId = generateUUID()

    vi.spyOn(CreateSessionDal, 'default').mockResolvedValue({ id: sessionId })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when a user has the reset GUID', () => {
    let user

    beforeEach(() => {
      user = { id: generateUUID() }

      vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(user)
    })

    it('creates a session containing the user', async () => {
      await InitiateCreatePasswordSessionService(resetGuid)

      expect(CreateSessionDal.default).toHaveBeenCalledWith({ user })
    })

    it('returns the redirect URL for the create password page', async () => {
      const result = await InitiateCreatePasswordSessionService(resetGuid)

      expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/create-password` })
    })
  })

  describe('when no user has the reset GUID', () => {
    beforeEach(() => {
      vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(undefined)
    })

    it('creates a session without a user', async () => {
      await InitiateCreatePasswordSessionService(resetGuid)

      expect(CreateSessionDal.default).toHaveBeenCalledWith({ user: undefined })
    })

    it('returns the redirect URL for the enter email page', async () => {
      const result = await InitiateCreatePasswordSessionService(resetGuid)

      expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/email` })
    })
  })
})
