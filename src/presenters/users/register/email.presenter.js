/**
 * Formats data for the '/users/register/{sessionId}/email' page
 * @module EmailPresenter
 */

import { formatEmail } from 'water-abstraction-engine/presenters/base.presenter.js'

/**
 * Formats data for the '/users/register/{sessionId}/email' page
 *
 * @param {object} session - The session instance
 *
 * @returns {object} The data formatted for the view template
 */
export default function emailPresenter(session) {
  const { email } = session

  return {
    backLink: {
      href: '/ext/users/register',
      text: 'Back'
    },
    email: formatEmail(email),
    pageTitle: 'Create an account'
  }
}
