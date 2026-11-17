/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/email' page
 * @module ViewEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import EmailPresenter from '../../../presenters/users/register/email.presenter.js'

/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/email' page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function viewEmailService(sessionId) {
  const session = await FetchSessionDal(sessionId)

  return EmailPresenter(session)
}
