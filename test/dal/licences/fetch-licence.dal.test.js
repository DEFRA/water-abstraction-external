// Test framework
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// Test helpers
import LicenceDocumentHeaderHelper from 'water-abstraction-engine/test/helpers/licence-document-header.helper.js'
import LicenceHelper from 'water-abstraction-engine/test/helpers/licence.helper.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'
import { yesterday } from 'water-abstraction-engine/test/general.js'

// Thing under test
import FetchLicenceDal from '../../../src/dal/licences/fetch-licence.dal.js'

describe('Licences - Fetch Licence DAL', () => {
  let licence
  let licenceDocumentHeader

  beforeAll(async () => {
    licence = await LicenceHelper.add({ expiredDate: yesterday(), startDate: new Date('2022-04-01') })
    licenceDocumentHeader = await LicenceDocumentHeaderHelper.add({
      licenceRef: licence.licenceRef,
      companyEntityId: generateUUID(),
      metadata: { IsCurrent: 'true' }
    })
  })

  afterAll(async () => {
    await licenceDocumentHeader.$query().delete()
    await licence.$query().delete()
  })

  describe('when the licence exists', () => {
    it('returns the matching licence', async () => {
      const result = await FetchLicenceDal(licence.id)

      expect(result).toEqual({
        expiredDate: licence.expiredDate,
        id: licence.id,
        issueDate: licence.issueDate,
        lapsedDate: licence.lapsedDate,
        licenceRef: licence.licenceRef,
        revokedDate: licence.revokedDate,
        startDate: licence.startDate,
        licenceDocumentHeader: {
          companyEntityId: licenceDocumentHeader.companyEntityId,
          current: licenceDocumentHeader.metadata.IsCurrent,
          deletedAt: licenceDocumentHeader.deletedAt,
          licenceName: licenceDocumentHeader.licenceName,
          id: licenceDocumentHeader.id
        }
      })
    })
  })
})
