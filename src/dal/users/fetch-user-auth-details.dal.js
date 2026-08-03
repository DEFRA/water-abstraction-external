/**
 * Fetch the authenticated user's details
 * @module FetchUserAuthDetailsDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'

/**
 * Fetch the authenticated user's details
 *
 * @param {number} userId - The user ID (integer not UUID) from the auth session of the user to fetch details for
 *
 * @returns {Promise<object>} the matching user instance, plus additional details
 */
export default async function fetchUserAuthDetailsDal(userId) {
  return UserModel.query()
    .select(['id', 'licenceEntityId', 'username'])
    .where('userId', userId)
    .limit(1)
    .first()
    .withGraphFetched('licenceEntity')
    .modifyGraph('licenceEntity', (licenceEntityBuilder) => {
      licenceEntityBuilder
        .select(['id'])
        .withGraphFetched('licenceEntityRoles')
        .modifyGraph('licenceEntityRoles', (licenceEntityRolesBuilder) => {
          // NOTE: A role must be linked to a licence for it to be considered. However, this being the crm schema
          // it has its own 'licence' records represented by `LicenceDocumentHeaders`, which are linked to roles
          // `companyEntityId`.
          licenceEntityRolesBuilder
            .select(['licenceEntityRoles.companyEntityId', 'licenceEntityRoles.id', 'licenceEntityRoles.role'])
            .innerJoin(
              'licenceDocumentHeaders',
              'licenceDocumentHeaders.companyEntityId',
              'licenceEntityRoles.companyEntityId'
            )
            .innerJoin('licences', 'licences.licenceRef', 'licenceDocumentHeaders.licenceRef')
        })
    })
}
