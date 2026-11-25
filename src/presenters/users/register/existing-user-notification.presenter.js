/**
 * Formats the data needed to create the notification for an existing user who has tried to register again
 * @module ExistingUserNotificationPresenter
 */

import ServerConfig from 'water-abstraction-engine/config/server.config.js'

/**
 * Formats the data needed to create the notification for an existing user who has tried to register again
 *
 * The email tells the user an account already exists, and contains a link to sign in and a link to reset their
 * password.
 *
 * @param {string} email - The email address of the existing user
 * @param {string} resetGuid - The reset GUID for the existing user
 *
 * @returns {object} The data needed to create the notification
 */
export default function existingUserNotificationPresenter(email, resetGuid) {
  const { external } = ServerConfig.domains

  return {
    messageRef: 'existing_user_verification_email',
    messageType: 'email',
    personalisation: {
      link: `${external}/signin`,
      resetLink: `${external}/reset_password_change_password?resetGuid=${resetGuid}`
    },
    recipient: email
  }
}
