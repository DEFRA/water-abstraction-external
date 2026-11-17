/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 * @module SubmitEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatEmail, formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'
import { flashNotification } from 'water-abstraction-engine/lib/general.lib.js'

import EmailPresenter from '../../../presenters/users/register/email.presenter.js'
import EmailValidator from '../../../validators/users/register/email.validator.js'

/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 *
 * If valid, the email address is saved to the session and the user is redirected to the check page. Otherwise, the
 * page data is returned with the validation errors.
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} payload - The submitted form data
 * @param {object} yar - The Hapi `request.yar` session manager passed on by the controller
 *
 * @returns {Promise<object>} The redirect URL, or the data formatted for the view template with errors
 */
export default async function submitEmailService(sessionId, payload, yar) {
  const session = await FetchSessionDal(sessionId)

  const validationResult = _validate(payload)

  if (!validationResult) {
    _notification(session, payload, yar)

    await _save(session, payload)

    return {
      redirectUrl: `/ext/users/register/${sessionId}/check`
    }
  }

  session.email = payload.email

  const pageData = EmailPresenter(session)

  return {
    error: validationResult,
    ...pageData
  }
}

function _notification(session, payload, yar) {
  if (session.checkPageVisited && session.email !== formatEmail(payload.email)) {
    flashNotification(yar, 'Updated', 'Email address updated')
  }
}

async function _save(session, payload) {
  session.email = formatEmail(payload.email)

  return session.$update()
}

function _validate(payload) {
  const validationResult = EmailValidator(payload)

  return formatValidationResult(validationResult)
}
