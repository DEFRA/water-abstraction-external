/**
 * Orchestrates cancelling the journey for the '/users/register/{sessionId}/cancel' page
 * @module SubmitCancelService
 */

import DeleteSessionDal from 'water-abstraction-engine/dal/delete-session.dal.js'

/**
 * Orchestrates cancelling the journey for the '/users/register/{sessionId}/cancel' page
 *
 * The session is deleted and the user is returned to the welcome page.
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {Promise<object>} The URL to redirect the user to
 */
export default async function submitCancelService(sessionId) {
  await DeleteSessionDal(sessionId)

  return {
    redirectUrl: '/welcome'
  }
}
