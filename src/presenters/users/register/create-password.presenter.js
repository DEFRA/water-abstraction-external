/**
 * Formats data for the '/users/register/{sessionId}/create-password' page
 * @module CreatePasswordPresenter
 */

/**
 * Formats data for the '/users/register/{sessionId}/create-password' page
 *
 * @param {object} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function createPasswordPresenter(session) {
  const { confirmPassword, password } = session

  return {
    confirmPassword: confirmPassword ?? null,
    pageTitle: 'Create a password',
    password: password ?? null
  }
}
