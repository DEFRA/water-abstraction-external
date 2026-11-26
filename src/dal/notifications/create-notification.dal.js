/**
 * Creates a notification record
 * @module CreateNotificationDal
 */

import NotificationModel from 'water-abstraction-engine/models/notification.model.js'

/**
 * Creates a notification record
 *
 * @param {object} notificationData - The data for the notification, for example from a notification presenter
 *
 * @returns {Promise<object>} The created notification
 */
export default async function createNotificationDal(notificationData) {
  return NotificationModel.query().insert(notificationData)
}
