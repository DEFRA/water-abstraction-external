/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/create-password' page
 * @module ViewCreatePasswordService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import CreatePasswordPresenter from '../../../presenters/users/register/create-password.presenter.js'

/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/create-password' page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function viewCreatePasswordService(sessionId) {
  const session = await FetchSessionDal(sessionId)

  return CreatePasswordPresenter(session)
}
