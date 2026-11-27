// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import YarStub from 'water-abstraction-engine/test/stubs/yar.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'
import * as FetchUserByResetGuidDal from '../../../../src/dal/users/fetch-user-by-reset-guid.dal.js'

// Thing under test
import InitiateCreatePasswordSessionService from '../../../../src/services/users/register/initiate-create-password-session.service.js'

describe('Users - Register - Initiate Create Password Session service', () => {
  let resetGuid
  let sessionId
  let yarStub

  beforeEach(() => {
    resetGuid = generateUUID()
    sessionId = generateUUID()

    yarStub = YarStub()

    vi.useFakeTimers({ now: new Date('2026-11-27T10:00:00.000Z'), toFake: ['Date'] })

    vi.spyOn(CreateSessionDal, 'default').mockResolvedValue({ id: sessionId })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when a user has the reset GUID', () => {
    let user

    describe('and it was created 48 hours ago', () => {
      beforeEach(() => {
        user = {
          id: generateUUID(),
          resetGuidCreatedAt: new Date('2026-11-25T10:00:00.000Z'),
          username: 'test@example.com'
        }

        vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(user)
      })

      it('creates a session containing the user', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(CreateSessionDal.default).toHaveBeenCalledWith({ user })
      })

      it('does not set a notification', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(yarStub.flash).not.toHaveBeenCalled()
      })

      it('returns the redirect URL for the create password page', async () => {
        const result = await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/create-password` })
      })
    })

    describe('and it was created more than 48 hours ago', () => {
      beforeEach(() => {
        user = {
          id: generateUUID(),
          resetGuidCreatedAt: new Date('2026-11-25T09:59:59.999Z'),
          username: 'test@example.com'
        }

        vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(user)
      })

      it('creates a session containing the user', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(CreateSessionDal.default).toHaveBeenCalledWith({ user })
      })

      it('sets the link expired notification', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        const [flashType, notification] = yarStub.flash.mock.calls[0]

        expect(flashType).toEqual('notification')
        expect(notification).toEqual({
          text: 'Links only work for 48 hours, and only the most recent link we sent works.',
          titleText: 'Link expired'
        })
      })

      it('returns the redirect URL for the enter email page', async () => {
        const result = await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/email` })
      })
    })

    describe('and it has no created date', () => {
      beforeEach(() => {
        user = { id: generateUUID(), resetGuidCreatedAt: null, username: 'test@example.com' }

        vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(user)
      })

      it('creates a session containing the user', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(CreateSessionDal.default).toHaveBeenCalledWith({ user })
      })

      it('sets the link expired notification', async () => {
        await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        const [flashType, notification] = yarStub.flash.mock.calls[0]

        expect(flashType).toEqual('notification')
        expect(notification).toEqual({
          text: 'Links only work for 48 hours, and only the most recent link we sent works.',
          titleText: 'Link expired'
        })
      })

      it('returns the redirect URL for the enter email page', async () => {
        const result = await InitiateCreatePasswordSessionService(resetGuid, yarStub)

        expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/email` })
      })
    })
  })

  describe('when no user has the reset GUID', () => {
    beforeEach(() => {
      vi.spyOn(FetchUserByResetGuidDal, 'default').mockResolvedValue(undefined)
    })

    it('creates a session without a user', async () => {
      await InitiateCreatePasswordSessionService(resetGuid, yarStub)

      expect(CreateSessionDal.default).toHaveBeenCalledWith({ user: undefined })
    })

    it('sets the link expired notification', async () => {
      await InitiateCreatePasswordSessionService(resetGuid, yarStub)

      const [flashType, notification] = yarStub.flash.mock.calls[0]

      expect(flashType).toEqual('notification')
      expect(notification).toEqual({
        text: 'Links only work for 48 hours, and only the most recent link we sent works.',
        titleText: 'Link expired'
      })
    })

    it('returns the redirect URL for the enter email page', async () => {
      const result = await InitiateCreatePasswordSessionService(resetGuid, yarStub)

      expect(result).toEqual({ redirectUrl: `/ext/users/register/${sessionId}/email` })
    })
  })
})
