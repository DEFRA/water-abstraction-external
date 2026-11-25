/**
 * Creates an external user account for the email address, or handles an account that already exists
 * @module CreateAccountService
 */

import CreateNotificationDal from '../../../dal/notifications/create-notification.dal.js'
import CreateUserDal from '../../../dal/users/create-user.dal.js'
import ExistingUserNotificationPresenter from '../../../presenters/users/register/existing-user-notification.presenter.js'
import FetchUserByEmailDal from '../../../dal/users/fetch-user-by-email.dal.js'
import NewUserNotificationPresenter from '../../../presenters/users/register/new-user-notification.presenter.js'
import SendResetPasswordEmailService from './send-reset-password-email.service.js'
import SendVerificationEmailService from './send-verification-email.service.js'
import UpdateResetGuidDal from '../../../dal/users/update-reset-guid.dal.js'

/**
 * Creates an external user account for the email address, or handles an account that already exists
 *
 * If an account already exists for the email address, the user is given a new reset GUID and sent an email with links
 * to sign in or reset their password. Otherwise, the user is created and sent an email with the link to set up their
 * account.
 *
 * If the existing account is disabled we do nothing, so no email is sent. The legacy IDM also refuses to send to a
 * disabled user. The caller still shows the same check email page, so we do not reveal that the account exists.
 *
 * The emails are sent in the background so the user is not kept waiting on Notify.
 *
 * @param {string} email - The formatted email address the user registered with
 */
export default async function createAccountService(email) {
  const existingUser = await FetchUserByEmailDal(email)

  if (existingUser && !existingUser.enabled) {
    return
  }

  if (existingUser) {
    const resetGuid = await UpdateResetGuidDal(existingUser.id)

    const notificationData = ExistingUserNotificationPresenter(email, resetGuid)

    const notification = await CreateNotificationDal(notificationData)

    SendResetPasswordEmailService(notification)
  } else {
    const user = await CreateUserDal(email)

    const notificationData = NewUserNotificationPresenter(email, user.resetGuid)

    const notification = await CreateNotificationDal(notificationData)

    SendVerificationEmailService(notification)
  }
}
