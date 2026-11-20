/**
 * Sends the verification email to a newly registered external user
 * @module SendVerificationEmailService
 */

import CreateEmailRequest from 'water-abstraction-engine/requests/notify/create-email.request.js'
import ServerConfig from 'water-abstraction-engine/config/server.config.js'

// Legacy 'new_user_verification_email' template. TODO: move to NOTIFY_TEMPLATES in water-abstraction-engine
const VERIFICATION_EMAIL_TEMPLATE_ID = '3d25b496-abbd-49bb-b943-016019082988'

/**
 * Sends the verification email to a newly registered external user
 *
 * The email contains a link with the user's reset GUID, which they use to set their password. Any errors are logged
 * rather than thrown.
 *
 * @param {string} email - The email address of the user
 * @param {string} resetGuid - The user's reset GUID
 */
export default async function sendVerificationEmailService(email, resetGuid) {
  try {
    const personalisation = {
      link: `${ServerConfig.domains.external}/create-password?resetGuid=${resetGuid}`
    }

    const result = await CreateEmailRequest(VERIFICATION_EMAIL_TEMPLATE_ID, email, { personalisation })

    if (!result.succeeded) {
      throw new Error('Notify request to send the verification email failed')
    }
  } catch (error) {
    globalThis.GlobalNotifier.omfg('Failed when trying to send external user verification email', { email }, error)
  }
}
