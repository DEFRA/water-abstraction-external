/**
 * Orchestrates starting the create password journey from the link in the new user verification email
 * @module SetupCreatePasswordService
 */

import CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'

import FetchUserByResetGuidDal from '../../../dal/users/fetch-user-by-reset-guid.dal.js'

/**
 * Orchestrates starting the create password journey from the link in the new user verification email
 *
 * The reset GUID in the link identifies the user. If no user has it, the link has already been used or a newer email
 * has replaced it. As legacy does, we send the user to the reset password page with the link expired message, where
 * they can ask for a new link.
 *
 * Otherwise, the reset GUID is saved to a new session for use when the user submits their password.
 *
 * @param {string} resetGuid - The reset GUID from the verification email link
 *
 * @returns {Promise<object>} The redirect URL
 */
export default async function setupCreatePasswordService(resetGuid) {
  const user = await FetchUserByResetGuidDal(resetGuid)

  if (!user) {
    return {
      redirectUrl: '/reset_password?flash=resetLinkExpired'
    }
  }

  const session = await CreateSessionDal({ resetGuid })

  return {
    redirectUrl: `/ext/users/register/${session.id}/create-password`
  }
}
