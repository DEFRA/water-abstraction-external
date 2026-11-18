/**
 * Formats data for the '/users/register/{sessionId}/check' page
 * @module CheckPresenter
 */

/**
 * Formats data for the '/users/register/{sessionId}/check' page
 *
 * @param {object} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function checkPresenter(session) {
  const { email, id: sessionId } = session

  return {
    email,
    links: {
      cancel: `/ext/users/register/${sessionId}/cancel`,
      email: `/ext/users/register/${sessionId}/email`
    },
    pageTitle: 'Check your details',
    pageTitleCaption: 'Create an account'
  }
}
