// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import LicenceModel from 'water-abstraction-engine/models/licence.model.js'
import { formatLongDate } from 'water-abstraction-engine/presenters/base.presenter.js'
import { yesterday } from 'water-abstraction-engine/test/general.js'
import { generateLicenceRef, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as FetchLicenceDal from '../../../src/dal/licences/fetch-licence.dal.js'

// Thing under test
import ViewLicenceService from '../../../src/services/licences/view-licence.service.js'

describe('Licences - View Licence Service', () => {
  let auth
  let licence

  beforeEach(() => {
    auth = {
      credentials: {
        permission: { manageAccess: true, manageReturns: true },
        scope: ['primary_user'],
        user: {
          id: generateUUID(),
          licenceEntityId: generateUUID(),
          username: 'external@example.co.uk',
          licenceEntity: {
            id: generateUUID(),
            licenceEntityRoles: [
              {
                companyEntityId: generateUUID(),
                id: generateUUID(),
                role: 'primary_user'
              }
            ]
          }
        }
      }
    }

    licence = LicenceModel.fromJson({
      expiredDate: null,
      id: generateUUID(),
      issueDate: new Date('2022-04-02'),
      lapsedDate: null,
      licenceRef: generateLicenceRef(),
      startDate: new Date('2022-04-01'),
      revokedDate: null,
      licenceDocumentHeader: {
        companyEntityId: auth.credentials.user.licenceEntity.licenceEntityRoles[0].companyEntityId,
        current: 'true',
        deletedAt: null,
        licenceName: 'Test Licence',
        id: generateUUID()
      }
    })

    vi.spyOn(FetchLicenceDal, 'default').mockResolvedValue(licence)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the requested licence is linked to the user', () => {
    describe('and it is "current" and not "deleted"', () => {
      it('returns page data for the view', async () => {
        const result = await ViewLicenceService(licence.id, auth)

        expect(result).toEqual({
          endDate: '',
          effectiveFrom: formatLongDate(licence.issueDate),
          licenceName: licence.licenceDocumentHeader.licenceName,
          pageTitle: `Licence ${licence.licenceRef}`
        })
      })
    })

    describe('but it is not "current"', () => {
      beforeEach(() => {
        licence.licenceDocumentHeader.current = 'false'
      })

      it('throws an exception', async () => {
        await expect(ViewLicenceService(licence.id, auth)).rejects.toMatchObject({
          isBoom: true,
          output: { statusCode: 404 }
        })
      })
    })

    describe('but it is "deleted"', () => {
      beforeEach(() => {
        licence.licenceDocumentHeader.deletedAt = yesterday()
      })

      it('throws an exception', async () => {
        await expect(ViewLicenceService(licence.id, auth)).rejects.toMatchObject({
          isBoom: true,
          output: { statusCode: 404 }
        })
      })
    })
  })

  describe('when the requested licence is not linked to the user', () => {
    beforeEach(() => {
      licence.licenceDocumentHeader.companyEntityId = generateUUID()
    })

    it('throws an exception', async () => {
      await expect(ViewLicenceService(licence.id, auth)).rejects.toMatchObject({
        isBoom: true,
        output: { statusCode: 404 }
      })
    })
  })
})
