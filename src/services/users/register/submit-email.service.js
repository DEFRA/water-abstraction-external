/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 * @module SubmitEmailService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatEmail, formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'

import CreateUserDal from '../../../dal/users/create-user.dal.js'
import EmailPresenter from '../../../presenters/users/register/email.presenter.js'
import EmailValidator from '../../../validators/users/register/email.validator.js'
import FetchUserByEmailDal from '../../../dal/users/fetch-user-by-email.dal.js'
import SendResetPasswordEmailService from './send-reset-password-email.service.js'
import SendVerificationEmailService from './send-verification-email.service.js'
import UpdateResetGuidDal from '../../../dal/users/update-reset-guid.dal.js'

/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/email' page
 *
 * If valid, the email address is saved to the session. If an account already exists for the email address, the user is
 * sent an email with links to sign in or reset their password. Otherwise, the user is created and sent an email with the
 * link to set up their account. Either way the user is redirected to the check email page, so we do not reveal whether
 * an account exists.
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

    await _createAccount(session.email)

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

async function _createAccount(email) {
  const existingUser = await FetchUserByEmailDal(email)

  if (existingUser) {
    const resetGuid = await UpdateResetGuidDal(existingUser.id)

    SendResetPasswordEmailService(email, resetGuid)

    return
  }

  const user = await CreateUserDal(email)

  SendVerificationEmailService(email, user.resetGuid)
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
