/**
 * Set a new reset GUID for a user
 * @module UpdateResetGuidDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateUUID } from 'water-abstraction-engine/lib/general.lib.js'

/**
 * Set a new reset GUID for a user
 *
 * The reset GUID is what identifies the user when they follow the link to set or reset their password
 * (`/reset_password_change_password?resetGuid=...`). The user is found by matching it against `users.reset_guid`.
 *
 * We need it when someone tries to register with an email address that already has an account. They are sent an email
 * with a link to sign in and a link to reset their password, and the reset link needs a valid GUID. An existing user
 * often has no reset GUID, because it is cleared (set to null) once a password has been set using it.
 *
 * This matches the legacy IDM `resetPassword` behaviour, which generates a new GUID before sending the email. Legacy
 * would reuse a GUID created in the last day, but nothing ever sets `reset_guid_date_created`, so in practice it always
 * generates a new one, as we do here. A new GUID means the reset link in any email sent before this one stops working.
 *
 * @param {number} id - The ID of the user to update
 *
 * @returns {Promise<string>} the new reset GUID
 */
export default async function updateResetGuidDal(id) {
  const resetGuid = generateUUID()

  await UserModel.query().patch({ resetGuid }).findById(id)

  return resetGuid
}
