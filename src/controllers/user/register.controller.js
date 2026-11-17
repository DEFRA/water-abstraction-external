/**
 * Controller for /user/register endpoints
 *
 * @module RegisterController
 */

import ViewRegisterService from '../../services/user/view-register.service.js'

export async function viewRegister(_request, h) {
  const pageData = ViewRegisterService()

  return h.view('user/register/view.njk', pageData)
}
