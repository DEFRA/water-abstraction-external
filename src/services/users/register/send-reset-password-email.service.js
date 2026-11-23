/**
 * Sends the reset password email and records the result against its notification
 * @module SendResetPasswordEmailService
 */

import CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'

import NotifyUpdatePresenter from '../../../presenters/notifications/notify-update.presenter.js'
import UpdateNotificationDal from '../../../dal/notifications/update-notification.dal.js'

// Legacy 'existing_user_verification_email' template. TODO: move to NOTIFY_TEMPLATES in water-abstraction-engine
const RESET_PASSWORD_TEMPLATE_ID = 'd9654596-a533-47e9-aa27-2cf869c6aa13'

/**
 * Sends the reset password email and records the result against its notification
 *
 * The result of the request to Notify is saved to the notification. Checking whether the email was delivered is left
 * to the system notification status job, which picks up all pending notifications. Any errors are logged rather than
 * thrown.
 *
 * @param {object} notification - The notification linked to the email to be sent
 */
export default async function sendResetPasswordEmailService(notification) {
  try {
    const { personalisation, recipient } = notification

    const notifyResult = await CreateEmailRequest(RESET_PASSWORD_TEMPLATE_ID, recipient, { personalisation })

    const sendResult = NotifyUpdatePresenter(notifyResult)

    await UpdateNotificationDal(notification, sendResult)
  } catch (error) {
    globalThis.GlobalNotifier.omfg(
      'Failed when trying to send external user reset password email',
      { notification },
      error
    )
  }
}
