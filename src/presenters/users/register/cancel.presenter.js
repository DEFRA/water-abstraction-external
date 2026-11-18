/**
 * Formats data for the '/users/register/{sessionId}/cancel' page
 * @module CancelPresenter
 */

/**
 * Formats data for the '/users/register/{sessionId}/cancel' page
 *
 * @param {object} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function cancelPresenter(session) {
  const { email, id: sessionId } = session

  return {
    backLink: {
      href: `/ext/users/register/${sessionId}/check`,
      text: 'Back'
    },
    email,
    pageTitle: 'You are about to cancel creating an account',
    pageTitleCaption: 'Create an account'
  }
}
