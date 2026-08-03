// Test framework
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import LicenceDocumentHeaderHelper from 'water-abstraction-engine/test/helpers/licence-document-header.helper.js'
import LicenceEntityHelper from 'water-abstraction-engine/test/helpers/licence-entity.helper.js'
import LicenceEntityRoleHelper from 'water-abstraction-engine/test/helpers/licence-entity-role.helper.js'
import LicenceHelper from 'water-abstraction-engine/test/helpers/licence.helper.js'
import UserHelper from 'water-abstraction-engine/test/helpers/user.helper.js'

// Test helpers
import { generateLicenceRef } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import FetchUserAuthDetailsDal from '../../../src/dal/users/fetch-user-auth-details.dal.js'

describe('Users - Fetch User Auth Details DAL', () => {
  let companyEntity
  let licence
  let licenceDocumentHeader
  let licenceRef
  let licenceEntityRole
  let user
  let userEntity

  beforeAll(async () => {
    licenceRef = generateLicenceRef()

    licence = await LicenceHelper.add({ licenceRef })

    companyEntity = await LicenceEntityHelper.add()
    userEntity = await LicenceEntityHelper.add()

    licenceDocumentHeader = await LicenceDocumentHeaderHelper.add({ companyEntityId: companyEntity.id, licenceRef })

    licenceEntityRole = await LicenceEntityRoleHelper.add({
      companyEntityId: companyEntity.id,
      licenceEntityId: userEntity.id,
      role: 'primary_user'
    })
    user = await UserHelper.add({ licenceEntityId: userEntity.id, username: 'external@example.com' })
  })

  afterAll(async () => {
    await licence.$query().delete()
    await companyEntity.$query().delete()
    await userEntity.$query().delete()
    await licenceDocumentHeader.$query().delete()
    await licenceEntityRole.$query().delete()
    await user.$query().delete()
  })

  describe('when the user exists', () => {
    it('returns the matching user details', async () => {
      const result = await FetchUserAuthDetailsDal(user.userId)

      expect(result).toEqual({
        id: user.id,
        licenceEntityId: user.licenceEntityId,
        username: user.username,
        licenceEntity: {
          id: userEntity.id,
          licenceEntityRoles: [
            {
              id: licenceEntityRole.id,
              companyEntityId: licenceEntityRole.companyEntityId,
              role: licenceEntityRole.role
            }
          ]
        }
      })
    })
  })
})
