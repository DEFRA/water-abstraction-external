/**
 * Controller for /users/register endpoints
 *
 * @module RegisterController
 */

import InitiateCreatePasswordSessionService from '../../services/users/register/initiate-create-password-session.service.js'
import InitiateSessionService from '../../services/users/register/initiate-session.service.js'
import SubmitCreatePasswordService from '../../services/users/register/submit-create-password.service.js'
import SubmitEmailService from '../../services/users/register/submit-email.service.js'
import ViewCheckEmailService from '../../services/users/register/view-check-email.service.js'
import ViewCreatePasswordService from '../../services/users/register/view-create-password.service.js'
import ViewEmailService from '../../services/users/register/view-email.service.js'
import ViewRegisterService from '../../services/users/register/view-register.service.js'

export async function setup(_request, h) {
  const session = await InitiateSessionService()

  return h.redirect(`/ext/users/register/${session.id}/email`)
}

export async function setupCreatePassword(request, h) {
  const {
    params: { resetGuid }
  } = request

  const pageData = await InitiateCreatePasswordSessionService(resetGuid)

  return h.redirect(pageData.redirectUrl)
}

export async function submitCreatePassword(request, h) {
  const {
    params: { sessionId }
  } = request

  const pageData = SubmitCreatePasswordService(sessionId)

  return h.redirect(pageData.redirectUrl)
}

export async function submitEmail(request, h) {
  const {
    payload,
    params: { sessionId }
  } = request

  const pageData = await SubmitEmailService(sessionId, payload)

  if (pageData.error) {
    return h.view('users/register/email.njk', pageData)
  }

  return h.redirect(pageData.redirectUrl)
}

export async function viewCheckEmail(request, h) {
  const {
    params: { sessionId }
  } = request

  const pageData = await ViewCheckEmailService(sessionId)

  return h.view('users/register/check-email.njk', pageData)
}

export async function viewCreatePassword(_request, h) {
  const pageData = ViewCreatePasswordService()

  return h.view('users/register/create-password.njk', pageData)
}

export async function viewEmail(request, h) {
  const {
    params: { sessionId }
  } = request

  const pageData = await ViewEmailService(sessionId)

  return h.view('users/register/email.njk', pageData)
}

export async function viewRegister(_request, h) {
  const pageData = ViewRegisterService()

  return h.view('users/register/view.njk', pageData)
}
