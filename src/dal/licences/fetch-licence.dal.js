/**
 * Fetch the matching Licence
 * @module FetchLicenceDal
 */

import LicenceModel from 'water-abstraction-engine/models/licence.model.js'
import Objection from 'water-abstraction-engine/wrappers/objection.wrapper.js'

/**
 * Fetch the matching Licence
 *
 * @param {string} licenceId - The licence's UUID
 *
 * @returns {Promise<object>} the matching licence instance
 */
export default async function fetchLicenceDal(licenceId) {
  return LicenceModel.query()
    .select(['id', 'issueDate', 'licenceRef', 'startDate'])
    .findById(licenceId)
    .modify('ended')
    .withGraphFetched('licenceDocumentHeader')
    .modifyGraph('licenceDocumentHeader', (licenceDocumentHeaderBuilder) => {
      licenceDocumentHeaderBuilder.select([
        'companyEntityId',
        'deletedAt',
        'id',
        'licenceName',
        Objection.ref('metadata:IsCurrent').castText().as('current')
      ])
    })
}
