// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import UserHelper from 'water-abstraction-engine/test/helpers/user.helper.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import FetchUserByResetGuidDal from '../../../src/dal/users/fetch-user-by-reset-guid.dal.js'

describe('Users - Fetch User By Reset GUID DAL', () => {
  describe('when an external user has the reset GUID', () => {
    let resetGuid
    let user

    beforeAll(async () => {
      resetGuid = generateUUID()

      user = await UserHelper.add({ application: 'water_vml', resetGuid })
    })

    it('returns the matching user', async () => {
      const result = await FetchUserByResetGuidDal(resetGuid)

      expect(result).toEqual({ id: user.id })
    })
  })

  describe('when only an internal user has the reset GUID', () => {
    let resetGuid

    beforeAll(async () => {
      resetGuid = generateUUID()

      await UserHelper.add({ application: 'water_admin', resetGuid })
    })

    it('returns undefined', async () => {
      const result = await FetchUserByResetGuidDal(resetGuid)

      expect(result).toBeUndefined()
    })
  })

  describe('when no user has the reset GUID', () => {
    it('returns undefined', async () => {
      const result = await FetchUserByResetGuidDal(generateUUID())

      expect(result).toBeUndefined()
    })
  })

  describe('when the reset GUID is not a valid GUID', () => {
    it('returns undefined', async () => {
      const result = await FetchUserByResetGuidDal('not-a-guid')

      expect(result).toBeUndefined()
    })
  })
})
