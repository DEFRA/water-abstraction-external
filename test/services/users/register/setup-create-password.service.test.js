// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'
import * as FetchUserByResetGuidDal from '../../../../src/dal/users/fetch-user-by-reset-guid.dal.js'

// Thing under test
import SetupCreatePasswordService from '../../../../src/services/users/register/setup-create-password.service.js'

describe('Users - Register - Setup Create Password service', () => {
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
    beforeEach(() => {
      vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue({ id: generateUUID() })
    })

    it('creates a session containing the reset GUID', async () => {
      await SetupCreatePasswordService(resetGuid)

      expect(CreateSessionDal.default).toHaveBeenCalledWith({ resetGuid })
    })

    it('returns the redirect URL for the create password page', async () => {
      const result = await SetupCreatePasswordService(resetGuid)

      expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/create-password` })
    })
  })

  describe('when no user has the reset GUID', () => {
    beforeEach(() => {
      vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(undefined)
    })

    it('does not create a session', async () => {
      await SetupCreatePasswordService(resetGuid)

      expect(CreateSessionDal.default).not.toHaveBeenCalled()
    })

    it('returns the redirect URL for the reset password page with the link expired message', async () => {
      const result = await SetupCreatePasswordService(resetGuid)

      expect(result).toEqual({ redirectUrl: '/reset_password?flash=resetLinkExpired' })
    })
  })
})
