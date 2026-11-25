// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import UserHelper from 'water-abstraction-engine/test/helpers/user.helper.js'
import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import UpdateResetGuidDal from '../../../src/dal/users/update-reset-guid.dal.js'

describe('Users - Update Reset Guid DAL', () => {
  let user

  beforeAll(async () => {
    user = await UserHelper.add({ application: 'water_vml', username: generateExternalEmailAddress() })
  })

  describe('when called', () => {
    it('sets a new reset GUID on the user and returns it', async () => {
      const result = await UpdateResetGuidDal(user.id)

      const updatedUser = await UserModel.query().findById(user.id)

      expect(result).toEqual(expect.any(String))
      expect(result).not.toEqual(user.resetGuid)
      expect(updatedUser.resetGuid).toEqual(result)
    })
  })
})
