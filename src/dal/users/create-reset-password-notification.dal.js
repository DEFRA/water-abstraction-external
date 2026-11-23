/**
 * Creates a reset password notification record for an external user who tried to register with an existing account
 * @module CreateResetPasswordNotificationDal
 */

import NotificationModel from 'water-abstraction-engine/models/notification.model.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'

/**
 * Creates a reset password notification record for an external user who tried to register with an existing account
 *
 * @param {string} email - The email address of the user
 * @param {string} resetGuid - The reset GUID for the user
 *
 * @returns {Promise<object>} The created notification
 */
export default async function createResetPasswordNotificationDal(email, resetGuid) {
  const { external } = ServerConfig.domains

  const personalisation = {
    link: `${external}/signin`,
    resetLink: `${external}/reset_password_change_password?resetGuid=${resetGuid}`
  }

  const notificationData = {
    messageRef: 'existing_user_verification_email',
    messageType: 'email',
    personalisation,
    recipient: email
  }

  return NotificationModel.query().insert(notificationData)
}
