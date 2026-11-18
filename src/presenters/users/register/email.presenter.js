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
  const { checkPageVisited, email, id: sessionId } = session

  return {
    backLink: {
      href: _href(checkPageVisited, sessionId),
      text: 'Back'
    },
    email: formatEmail(email),
    pageTitle: 'Enter your email address',
    pageTitleCaption: 'Create an account'
  }
}

function _href(checkPageVisited, sessionId) {
  if (checkPageVisited) {
    return `/ext/users/register/${sessionId}/check`
  }

  return '/ext/users/register'
}
