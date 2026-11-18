/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/check-email' page
 * @module ViewCheckEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import CheckEmailPresenter from '../../../presenters/users/register/check-email.presenter.js'

/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/check-email' page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function viewCheckEmailService(sessionId) {
  const session = await FetchSessionDal(sessionId)

  return CheckEmailPresenter(session)
}
