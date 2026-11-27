/**
 * Create a user
 * @module CreateUserDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateUUID, timestampForPostgres } from 'water-abstraction-engine/lib/general.lib.js'

/**
 * Create a user
 *
 * Creates the external user without a usable password. They set their own password by following the link in the
 * verification email. The values match what legacy `createUserWithoutPassword` saves.
 *
 * The `password` is a hashed random UUID that nobody knows, so the account cannot be signed in to until the user sets
 * their own password.
 *
 * The `resetGuid` identifies the user when they follow the create password link
 * (`/ext/users/register/setup/create-password/{resetGuid}`) in the verification email. The `resetGuidCreatedAt` is
 * stamped with it, because the link expires 48 hours after it was created. Legacy never sets it.
 *
 * The `resetRequired` flag is set to 1 to mark that the user still has to set their own password. If a user with it
 * set signs in, legacy sends them to the change password page instead of signing them in. Setting the password with the
 * reset GUID clears it back to 0, and clears the reset GUID.
 *
 * @param {string} email - The users email address
 *
 * @returns {Promise<object>} the created user
 */
export default async function createUserDal(email) {
  return UserModel.query().insert({
    application: 'water_vml',
    password: UserModel.generateHashedPassword(generateUUID()),
    resetGuid: generateUUID(),
    resetGuidCreatedAt: timestampForPostgres(),
    resetRequired: 1,
    role: {
      scopes: ['external']
    },
    userData: {},
    username: email
  })
}
