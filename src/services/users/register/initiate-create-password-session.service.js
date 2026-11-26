/**
 * Initiates the session record used for a new user creating their password
 * @module InitiateCreatePasswordSessionService
 */

import CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'

import FetchUserByResetGuidDal from '../../../dal/users/fetch-user-by-reset-guid.dal.js'

/**
 * Initiates the session record used for a new user creating their password
 *
 * The user arrives from the link in the new user verification email. The reset GUID in that link identifies them, so
 * it is saved to a new session for use when they submit their password.
 *
 * If no user has the reset GUID, the link has already been used or a newer email has replaced it. The user is sent to
 * the enter email page with the session instead, so they can start creating their account again.
 *
 * @param {string} resetGuid - The reset GUID from the verification email link
 *
 * @returns {Promise<object>} The redirect URL
 */
export default async function initiateCreatePasswordSessionService(resetGuid) {
  const session = await CreateSessionDal({ resetGuid })

  const user = await FetchUserByResetGuidDal(resetGuid)

  if (!user) {
    return {
      redirectUrl: `/ext/users/register/${session.id}/email`
    }
  }

  return {
    redirectUrl: `/ext/users/register/${session.id}/create-password`
  }
}
