/**
 * Orchestrates handling the data submitted for the '/users/register/{sessionId}/create-password' page
 * @module SubmitCreatePasswordService
 */

/**
 * Orchestrates handling the data submitted for the '/users/register/{sessionId}/create-password' page
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {object} The redirect URL
 */
export default function submitCreatePasswordService(sessionId) {
  return {
    redirectUrl: `/ext/users/register/${sessionId}/account-created`
  }
}
