// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import UserHelper from 'water-abstraction-engine/test/helpers/user.helper.js'
import UserModel from 'water-abstraction-engine/models/user.model.js'
import { compareSync } from 'bcryptjs'
import { generateExternalEmailAddress, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import UpdatePasswordDal from '../../../src/dal/users/update-password.dal.js'

describe('Users - Update Password DAL', () => {
  let user

  beforeAll(async () => {
    user = await UserHelper.add({
      application: 'water_vml',
      badLogins: 3,
      resetGuid: generateUUID(),
      resetRequired: 1,
      username: generateExternalEmailAddress()
    })
  })

  describe('when called', () => {
    it('sets the hashed password and clears the reset details', async () => {
      await UpdatePasswordDal(user.id, 'Password1!')

      const updatedUser = await UserModel.query().findById(user.id)

      expect(compareSync('Password1!', updatedUser.password)).toBe(true)
      expect(updatedUser.badLogins).toEqual(0)
      expect(updatedUser.resetGuid).toBeNull()
      expect(updatedUser.resetRequired).toEqual(0)
    })
  })
})
