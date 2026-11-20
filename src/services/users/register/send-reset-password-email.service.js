/**
 * Sends the reset password email to an external user who tried to register with an existing account
 * @module SendResetPasswordEmailService
 */

import CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'

// Legacy 'existing_user_verification_email' template. TODO: move to NOTIFY_TEMPLATES in water-abstraction-engine
const RESET_PASSWORD_TEMPLATE_ID = 'd9654596-a533-47e9-aa27-2cf869c6aa13'

/**
 * Sends the reset password email to an external user who tried to register with an existing account
 *
 * The email tells the user they already have an account, with links to sign in or reset their password. Any errors
 * are logged rather than thrown.
 *
 * @param {string} email - The email address of the user
 * @param {string} resetGuid - The user's reset GUID
 */
export default async function sendResetPasswordEmailService(email, resetGuid) {
  try {
    const { external } = ServerConfig.domains

    const personalisation = {
      link: `${external}/signin`,
      resetLink: `${external}/reset_password_change_password?resetGuid=${resetGuid}`
    }

    const result = await CreateEmailRequest(RESET_PASSWORD_TEMPLATE_ID, email, { personalisation })

    if (!result.succeeded) {
      throw new Error('Notify request to send the reset password email failed')
    }
  } catch (error) {
    globalThis.GlobalNotifier.omfg('Failed when trying to send external user reset password email', { email }, error)
  }
}
