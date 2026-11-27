// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CreateUserDal from '../../../src/dal/users/create-user.dal.js'

describe('Users - Create User DAL', () => {
  const date = new Date('2026-11-27T10:00:00.000Z')

  let email

  beforeEach(() => {
    email = generateExternalEmailAddress()

    vi.useFakeTimers({ now: date, toFake: ['Date'] })

    vi.spyOn(UserModel, 'generateHashedPassword').mockReturnValue('hashed-password')
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('creates an external user with a reset GUID stamped with when it was created', async () => {
      const result = await CreateUserDal(email)

      const user = await UserModel.query().findById(result.id)

      expect(user).toEqual({
        application: 'water_vml',
        badLogins: null,
        createdAt: expect.any(Date),
        enabled: true,
        id: result.id,
        lastLogin: null,
        licenceEntityId: null,
        password: 'hashed-password',
        resetGuid: result.resetGuid,
        resetGuidCreatedAt: date,
        resetRequired: 1,
        role: { scopes: ['external'] },
        updatedAt: expect.any(Date),
        userData: {},
        userId: expect.any(Number),
        username: email
      })
    })
  })
})
