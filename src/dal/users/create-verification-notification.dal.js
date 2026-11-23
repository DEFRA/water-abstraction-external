/**
 * Creates a verification notification record for a newly registered external user
 * @module CreateVerificationNotificationDal
 */

import NotificationModel from 'water-abstraction-engine/models/notification.model.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'

/**
 * Creates a verification notification record for a newly registered external user
 *
 * @param {string} email - The email address of the new user
 * @param {string} resetGuid - The reset GUID for the new user
 *
 * @returns {Promise<object>} The created notification
 */
export default async function createVerificationNotificationDal(email, resetGuid) {
  const personalisation = {
    link: `${ServerConfig.domains.external}/create-password?resetGuid=${resetGuid}`
  }

  const notificationData = {
    messageRef: 'new_user_verification_email',
    messageType: 'email',
    personalisation,
    recipient: email
  }

  return NotificationModel.query().insert(notificationData)
}
