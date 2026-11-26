/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 * @module SubmitEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatEmail, formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'

import CreateAccountService from './create-account.service.js'
import EmailPresenter from '../../../presenters/users/register/email.presenter.js'
import EmailValidator from '../../../validators/users/register/email.validator.js'

/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 *
 * If valid, the email address is saved to the session and the account is created (or the existing account holder is
 * emailed). Either way the user is redirected to the check email page, so we do not reveal whether an account exists.
 *
 * If invalid, the page data is returned with the validation errors.
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

    await CreateAccountService(session.email)

    return {
      redirectUrl: `/ext/users/register/${sessionId}/check-email`
    }
  }

  session.email = payload.email

  const pageData = EmailPresenter(session)

  return {
    error: validationResult,
    ...pageData
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
