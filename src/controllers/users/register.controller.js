/**
 * Controller for /users/register endpoints
 *
 * @module RegisterController
 */

import ViewRegisterService from '../../services/users/view-register.service.js'

export async function viewRegister(_request, h) {
  const pageData = ViewRegisterService()

  return h.view('users/register/view.njk', pageData)
}
