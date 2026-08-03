/**
 * Orchestrates fetching and presenting the data needed for the licence page
 * @module ViewLicenceService
 */

import Boom from 'water-abstraction-engine/wrappers/boom.wrapper.js'

import FetchLicenceDal from '../../dal/licences/fetch-licence.dal.js'
import LicencePresenter from '../../presenters/licences/licence.presenter.js'

/**
 * Orchestrates fetching and presenting the data needed for the licence page
 *
 * > Note: This is a demo service to confirm we can integrate with the legacy service and display our own pages. We
 * > expect it to be replaced when we properly migrate the legacy view licence page.
 *
 * @param {string} licenceId - The UUID for the licence to view
 * @param {object} auth - The auth object taken from `request.auth` containing user details
 *
 * @returns {Promise<object>} an object representing the `pageData` needed by the view licence template. It contains
 * details of the licence and any linked data plus the page title.
 */
export default async function viewLicenceService(licenceId, auth) {
  const licence = await FetchLicenceDal(licenceId)

  const showLicence = _showLicence(licence, auth)

  if (!showLicence) {
    // NOTE: It's a security practice to return '404 - Not found' rather than '403 - Forbidden'. 403 confirms the
    // resource exists, just that _this_ user is not permitted to access it. 404 confirms nothing.
    throw Boom.notFound('Licence not linked to user')
  }

  const pageData = LicencePresenter(licence)

  return {
    ...pageData
  }
}

/**
 * In the internal app, all users can see any licence. In the external app, users are only allowed to see licences
 * linked to their account, and then only if they are not deleted and 'current'.
 *
 * This function determines if we can show the selected licence to the current user.
 *
 * @private
 */
function _showLicence(licence, auth) {
  const { licenceEntityRoles } = auth.credentials.user.licenceEntity
  const { companyEntityId, current, deletedAt } = licence.licenceDocumentHeader

  if (deletedAt || current === 'false') {
    return false
  }

  return licenceEntityRoles.some((role) => {
    return role.companyEntityId === companyEntityId
  })
}
