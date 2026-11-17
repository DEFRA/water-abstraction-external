/**
 * Controller for /users/register endpoints
 *
 * @module RegisterController
 */

import InitiateSessionService from '../../services/users/register/initiate-session.service.js'
import ViewRegisterService from '../../services/users/register/view-register.service.js'

export async function setup(_request, h) {
  const session = await InitiateSessionService()

  return h.redirect(`/ext/users/register/${session.id}/email`)
}

export async function viewRegister(_request, h) {
  const pageData = ViewRegisterService()

  return h.view('users/register/view.njk', pageData)
}
