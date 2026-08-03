/**
 * Formats data for the `/licences/{id}` page
 * @module LicencePresenter
 */

import { formatLongDate } from 'water-abstraction-engine/presenters/base.presenter.js'

/**
 * Formats data for the `/licences/{id}` page
 *
 * @param {object} licence - The licence details
 *
 * @returns {object} The data formatted for the view template
 */
export default function licencePresenter(licence) {
  const { licenceDocumentHeader, licenceRef } = licence

  return {
    endDate: _endDate(licence),
    effectiveFrom: _effectiveFrom(licence),
    licenceName: _licenceName(licenceDocumentHeader),
    pageTitle: `Licence ${licenceRef}`
  }
}

function _effectiveFrom(licence) {
  const { startDate, issueDate } = licence

  if (issueDate) {
    return formatLongDate(issueDate)
  }

  return formatLongDate(startDate)
}

function _endDate(licence) {
  const ends = licence.$ends()

  if (!ends) {
    return ''
  }

  return formatLongDate(ends.date)
}

function _licenceName(licenceDocumentHeader) {
  const { licenceName } = licenceDocumentHeader

  return licenceName ?? 'No name chosen'
}
