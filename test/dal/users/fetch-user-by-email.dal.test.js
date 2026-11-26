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

      expect(result).toEqual({ enabled: true, id: user.id })
    })
  })

  describe('when an external user exists with the email address in a different case', () => {
    let mixedCaseEmail
    let mixedCaseUser

    beforeAll(async () => {
      mixedCaseEmail = generateExternalEmailAddress()

      mixedCaseUser = await UserHelper.add({ application: 'water_vml', username: mixedCaseEmail.toUpperCase() })
    })

    it('returns the matching user', async () => {
      const result = await FetchUserByEmailDal(mixedCaseEmail.toLowerCase())

      expect(result).toEqual({ enabled: true, id: mixedCaseUser.id })
    })
  })

  describe('when the matching external user is disabled', () => {
    let disabledEmail
    let disabledUser

    beforeAll(async () => {
      disabledEmail = generateExternalEmailAddress()

      disabledUser = await UserHelper.add({ application: 'water_vml', enabled: false, username: disabledEmail })
    })

    it('returns the matching user flagged as not enabled', async () => {
      const result = await FetchUserByEmailDal(disabledEmail)

      expect(result).toEqual({ enabled: false, id: disabledUser.id })
    })
  })

  describe('when no external user exists with the email address', () => {
    it('returns undefined', async () => {
      const result = await FetchUserByEmailDal(generateExternalEmailAddress())

      expect(result).toBeUndefined()
    })
  })
})
