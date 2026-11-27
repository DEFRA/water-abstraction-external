/**
 * Initiates the session record used for a new user creating their password
 * @module InitiateCreatePasswordSessionService
 */

import CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'
import { flashNotification } from 'water-abstraction-engine/lib/general.lib.js'

import FetchUserByResetGuidDal from '../../../dal/users/fetch-user-by-reset-guid.dal.js'

const LINK_EXPIRY_IN_HOURS = 48

/**
 * Initiates the session record used for a new user creating their password
 *
 * The user arrives from the link in the new user verification email. The reset GUID in that link identifies them, so
 * the matching user (their ID and email address) is saved to a new session for use when they submit their password.
 *
 * If no user has the reset GUID, the link has already been used or a newer email has replaced it. The session is still
 * created, without a user, and the user is sent to the enter email page instead, so they can start creating their
 * account again.
 *
 * Unlike legacy, the link also expires 48 hours after the reset GUID was created. A reset GUID without a created date
 * is treated as expired. If the user is found but their reset GUID has expired, the user is still saved to the
 * session, and they are sent to the enter email page in the same way.
 *
 * Either way a notification is flashed, so the enter email page tells the user the link has expired.
 *
 * @param {string} resetGuid - The reset GUID from the verification email link
 * @param {object} yar - The Hapi `request.yar` session manager passed on by the controller
 *
 * @returns {Promise<object>} The redirect URL
 */
export default async function initiateCreatePasswordSessionService(resetGuid, yar) {
  const user = await FetchUserByResetGuidDal(resetGuid)

  const session = await CreateSessionDal({ user })

  if (!user || _expired(user.resetGuidCreatedAt)) {
    flashNotification(
      yar,
      'Link expired',
      `Links only work for ${LINK_EXPIRY_IN_HOURS} hours, and only the most recent link we sent works.`
    )

    return {
      redirectUrl: `/ext/users/register/${session.id}/email`
    }
  }

  return {
    redirectUrl: `/ext/users/register/${session.id}/create-password`
  }
}

function _expired(resetGuidCreatedAt) {
  if (!resetGuidCreatedAt) {
    return true
  }

  const expiresAt = new Date(resetGuidCreatedAt)

  expiresAt.setHours(expiresAt.getHours() + LINK_EXPIRY_IN_HOURS)

  return new Date() > expiresAt
}
