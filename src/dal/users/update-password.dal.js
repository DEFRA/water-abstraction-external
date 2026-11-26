/**
 * Set a new password for a user
 * @module UpdatePasswordDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'

/**
 * Set a new password for a user
 *
 * The values match what legacy `updatePasswordWithGuid` saves. The password is hashed before it is saved.
 *
 * The reset GUID is cleared, so the link in the email the user followed to get here cannot be used again. The
 * `resetRequired` flag is cleared, because the user has now set their own password, and `badLogins` is reset to 0.
 *
 * @param {number} id - The ID of the user to update
 * @param {string} password - The new password, in plain text
 */
export default async function updatePasswordDal(id, password) {
  await UserModel.query()
    .patch({
      badLogins: 0,
      password: UserModel.generateHashedPassword(password),
      resetGuid: null,
      resetRequired: 0
    })
    .findById(id)
}
