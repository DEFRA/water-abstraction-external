/**
 * Controller for /users/register endpoints
 *
 * @module RegisterController
 */

import InitiateSessionService from '../../services/users/register/initiate-session.service.js'
import SubmitCheckService from '../../services/users/register/submit-check.service.js'
import SubmitEmailService from '../../services/users/register/submit-email.service.js'
import ViewCheckService from '../../services/users/register/view-check.service.js'
import ViewEmailService from '../../services/users/register/view-email.service.js'
import ViewRegisterService from '../../services/users/register/view-register.service.js'

export async function setup(_request, h) {
  const session = await InitiateSessionService()

  return h.redirect(`/ext/users/register/${session.id}/email`)
}

export function submitCheck(request, h) {
  const {
    params: { sessionId }
  } = request

  const { redirectUrl } = SubmitCheckService(sessionId)

  return h.redirect(redirectUrl)
}

export async function submitEmail(request, h) {
  const {
    payload,
    params: { sessionId },
    yar
  } = request

  const pageData = await SubmitEmailService(sessionId, payload, yar)

  if (pageData.error) {
    return h.view('users/register/email.njk', pageData)
  }

  return h.redirect(pageData.redirectUrl)
}

export async function viewCheck(request, h) {
  const {
    params: { sessionId },
    yar
  } = request

  const pageData = await ViewCheckService(sessionId, yar)

  return h.view('users/register/check.njk', pageData)
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
