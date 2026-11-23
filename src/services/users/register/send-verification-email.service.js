/**
 * Sends the verification email and records the result against its notification
 * @module SendVerificationEmailService
 */

import CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'

import NotifyUpdatePresenter from '../../../presenters/notifications/notify-update.presenter.js'
import UpdateNotificationDal from '../../../dal/notifications/update-notification.dal.js'

// Legacy 'new_user_verification_email' template. TODO: move to NOTIFY_TEMPLATES in water-abstraction-engine
const VERIFICATION_EMAIL_TEMPLATE_ID = '3d25b496-abbd-49bb-b943-016019082988'

/**
 * Sends the verification email and records the result against its notification
 *
 * The result of the request to Notify is saved to the notification. Checking whether the email was delivered is left
 * to the system notification status job, which picks up all pending notifications. Any errors are logged rather than
 * thrown.
 *
 * @param {object} notification - The notification linked to the email to be sent
 */
export default async function sendVerificationEmailService(notification) {
  try {
    const { personalisation, recipient } = notification

    const notifyResult = await CreateEmailRequest(VERIFICATION_EMAIL_TEMPLATE_ID, recipient, { personalisation })

    const sendResult = NotifyUpdatePresenter(notifyResult)

    await UpdateNotificationDal(notification, sendResult)
  } catch (error) {
    globalThis.GlobalNotifier.omfg(
      'Failed when trying to send external user verification email',
      { notification },
      error
    )
  }
}
