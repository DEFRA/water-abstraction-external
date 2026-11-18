/**
 * Orchestrates handling the data for the '/users/register/{sessionId}/check' page
 * @module SubmitCheckService
 */

/**
 * Orchestrates handling the data for the '/users/register/{sessionId}/check' page
 *
 * Creating the user and sending the email with the link to set up their account will be added later. For now the user
 * is redirected to the check email page.
 *
 * @param {string} sessionId - The UUID of the current session
 *
 * @returns {object} The URL to redirect the user to
 */
export default function submitCheckService(sessionId) {
  return {
    redirectUrl: `/ext/users/register/${sessionId}/check-email`
  }
}
