/**
 * Formats the data needed to create the notification for a new user's verification email
 * @module NewUserNotificationPresenter
 */

import ServerConfig from 'water-abstraction-engine/config/server.config.js'

/**
 * Formats the data needed to create the notification for a new user's verification email
 *
 * The email contains the link the user follows to create their password and finish setting up their account.
 *
 * @param {string} email - The email address of the new user
 * @param {string} resetGuid - The reset GUID for the new user
 *
 * @returns {object} The data needed to create the notification
 */
export default function newUserNotificationPresenter(email, resetGuid) {
  const { external } = ServerConfig.domains

  return {
    messageRef: 'new_user_verification_email',
    messageType: 'email',
    personalisation: {
      link: `${external}/ext/users/register/setup/create-password/${resetGuid}`
    },
    recipient: email
  }
}
