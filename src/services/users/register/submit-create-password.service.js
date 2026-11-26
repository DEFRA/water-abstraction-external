/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/create-password' page
 * @module SubmitCreatePasswordService
 */

import FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'
import { formatValidationResult } from 'water-abstraction-engine/presenters/base.presenter.js'

import CreatePasswordPresenter from '../../../presenters/users/register/create-password.presenter.js'
import CreatePasswordValidator from '../../../validators/users/register/create-password.validator.js'
import UpdatePasswordDal from '../../../dal/users/update-password.dal.js'

/**
 * Orchestrates validating the data for the '/users/register/{sessionId}/create-password' page
 *
 * If valid, the password is saved against the user held in the session, and the user is redirected to the sign in
 * page, as legacy does.
 *
 * If invalid, the page data is returned with the validation errors and the passwords entered.
 *
 * @param {string} sessionId - The UUID of the current session
 * @param {object} payload - The submitted form data
 *
 * @returns {Promise<object>} The redirect URL, or the data formatted for the view template with errors
 */
export default async function submitCreatePasswordService(sessionId, payload) {
  const session = await FetchSessionDal(sessionId)

  const validationResult = _validate(payload)

  if (!validationResult) {
    await UpdatePasswordDal(session.user.id, payload.password)

    return {
      redirectUrl: '/signin'
    }
  }

  session.confirmPassword = payload.confirmPassword
  session.password = payload.password

  const pageData = CreatePasswordPresenter(session)

  return {
    error: validationResult,
    ...pageData
  }
}

function _validate(payload) {
  const validationResult = CreatePasswordValidator(payload)

  return formatValidationResult(validationResult)
}
