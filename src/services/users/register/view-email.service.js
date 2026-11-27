/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/email' page
 * @module ViewEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { readFlashNotification } from 'water-abstraction-engine/lib/general.lib.js'

import EmailPresenter from '../../../presenters/users/register/email.presenter.js'

/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/email' page
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} yar - The Hapi `request.yar` session manager passed on by the controller
 *
 * @returns {Promise<object>} The data formatted for the view template
 */
export default async function viewEmailService(sessionId, yar) {
  const session = await FetchSessionDal(sessionId)

  const notification = readFlashNotification(yar)

  const pageData = EmailPresenter(session)

  return {
    notification,
    ...pageData
  }
}
