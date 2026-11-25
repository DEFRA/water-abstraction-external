// Test framework
import { beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import UserHelper from 'water-abstraction-engine/test/helpers/user.helper.js'
import { generateExternalEmailAddress } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import FetchUserByEmailDal from '../../../src/dal/users/fetch-user-by-email.dal.js'

describe('Users - Fetch User By Email DAL', () => {
  let email
  let user

  beforeAll(async () => {
    email = generateExternalEmailAddress()

    user = await UserHelper.add({ application: 'water_vml', username: email })

    // An internal user with the same email should not be matched
    await UserHelper.add({ application: 'water_admin', username: email })
  })

  describe('when an external user exists with the email address', () => {
    it('returns the matching user', async () => {
      const result = await FetchUserByEmailDal(email)

      expect(result).toEqual({ id: user.id })
    })
  })

  describe('when no external user exists with the email address', () => {
    it('returns undefined', async () => {
      const result = await FetchUserByEmailDal(generateExternalEmailAddress())

      expect(result).toBeUndefined()
    })
  })
})
