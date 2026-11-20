/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 * @module SubmitEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatEmail, formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'

import EmailPresenter from '../../../presenters/users/register/email.presenter.js'
import EmailValidator from '../../../validators/users/register/email.validator.js'

/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 *
 * If valid, the email address is saved to the session and the user is redirected to the check email page. Otherwise,
 * the page data is returned with the validation errors.
 *
 * Creating the user and sending the email with the link to set up their account will be added later.
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} payload - The submitted form data
 *
 * @returns {Promise<object>} The redirect URL, or the data formatted for the view template with errors
 */
export default async function submitEmailService(sessionId, payload) {
  const session = await FetchSessionDal(sessionId)

  const validationResult = _validate(payload)

  if (!validationResult) {
    await _save(session, payload)

    return {
      redirectUrl: `/ext/users/register/${sessionId}/check-email`
    }
  }

  session.confirmEmail = payload.confirmEmail
  session.email = payload.email

  const pageData = EmailPresenter(session)

  return {
    error: validationResult,
    ...pageData
  }
}

async function _save(session, payload) {
  session.confirmEmail = formatEmail(payload.confirmEmail)
  session.email = formatEmail(payload.email)

  return session.$update()
}

function _validate(payload) {
  const validationResult = EmailValidator(payload)

  return formatValidationResult(validationResult)
}
