/**
 * Formats data for the '/users/register/{sessionId}/check-email' page
 * @module CheckEmailPresenter
 */

/**
 * Formats data for the '/users/register/{sessionId}/check-email' page
 *
 * @param {object} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function checkEmailPresenter(session) {
  const { email } = session

  return {
    email,
    pageTitle: 'Check your email',
    pageTitleCaption: 'Create an account'
  }
}
