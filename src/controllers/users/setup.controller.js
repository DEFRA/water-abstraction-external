/**
 * Controller for /users/setup endpoints
 *
 * @module UsersSetupController
 */

import InitiateSessionService from '../../services/users/setup/initiate-session.service.js'

export async function setup(_request, h) {
  const session = await InitiateSessionService()

  return h.redirect(`/ext/users/setup/${session.id}/email-address`)
}
