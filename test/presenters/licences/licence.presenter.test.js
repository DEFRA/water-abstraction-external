// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import LicenceModel from 'water-abstraction-engine/models/licence.model.js'
import { formatLongDate } from 'water-abstraction-engine/presenters/base.presenter.js'
import { yesterday } from 'water-abstraction-engine/test/general.js'
import { generateLicenceRef, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import LicencePresenter from '../../../src/presenters/licences/licence.presenter.js'

describe('Licences - Licence Presenter', () => {
  let licence

  beforeEach(() => {
    licence = LicenceModel.fromJson({
      expiredDate: null,
      id: generateUUID(),
      issueDate: new Date('2022-04-02'),
      lapsedDate: null,
      licenceRef: generateLicenceRef(),
      startDate: new Date('2022-04-01'),
      revokedDate: null,
      licenceDocumentHeader: {
        companyEntityId: generateUUID(),
        current: 'true',
        deletedAt: null,
        licenceName: 'Test Licence',
        id: generateUUID()
      }
    })
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = LicencePresenter(licence)

      expect(result).toEqual({
        endDate: '',
        effectiveFrom: formatLongDate(licence.issueDate),
        licenceName: licence.licenceDocumentHeader.licenceName,
        pageTitle: `Licence ${licence.licenceRef}`
      })
    })
  })

  describe('the "endDate" property', () => {
    describe('when the licence has an end date (expired, lapsed or revoked)', () => {
      beforeEach(() => {
        licence.expiredDate = yesterday()
      })

      it('returns the formatted end date', () => {
        const result = LicencePresenter(licence)

        expect(result.endDate).toEqual(formatLongDate(licence.expiredDate))
      })
    })

    describe('when the licence does not have an end date (expired, lapsed or revoked)', () => {
      it('returns an empty string', () => {
        const result = LicencePresenter(licence)

        expect(result.endDate).toEqual('')
      })
    })
  })

  describe('the "effectiveFrom" property', () => {
    describe('when the licence has an "issue date"', () => {
      it('returns the formatted issue date', () => {
        const result = LicencePresenter(licence)

        expect(result.effectiveFrom).toEqual(formatLongDate(licence.issueDate))
      })
    })

    describe('when the licence does not have an "issue date"', () => {
      beforeEach(() => {
        licence.issueDate = null
      })

      it('returns the formatted start date', () => {
        const result = LicencePresenter(licence)

        expect(result.effectiveFrom).toEqual(formatLongDate(licence.startDate))
      })
    })
  })

  describe('the "licenceName" property', () => {
    describe('when the licence has a "licence name"', () => {
      it('returns the licence name', () => {
        const result = LicencePresenter(licence)

        expect(result.licenceName).toEqual(licence.licenceDocumentHeader.licenceName)
      })
    })

    describe('when the licence does not have a "licence name"', () => {
      beforeEach(() => {
        licence.licenceDocumentHeader.licenceName = null
      })

      it('returns "No name chosen"', () => {
        const result = LicencePresenter(licence)

        expect(result.licenceName).toEqual('No name chosen')
      })
    })
  })
})
