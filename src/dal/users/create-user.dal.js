/**
 * Create a user
 * @module CreateUserDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateUUID } from 'water-abstraction-engine/lib/general.lib.js'

/**
 * Create a user
 *
 * @param {string} email - The users email address
 *
 * @returns {Promise<object>} the created user
 */
export default async function createUserDal(email) {
  return UserModel.query().insert({
    application: 'water_vml',
    // Placeholder random password until the user sets their own via the link in the verification email
    password: UserModel.generateHashedPassword(generateUUID()),
    resetGuid: generateUUID(),
    resetRequired: 1,
    userData: {},
    username: email
    // role: {
    //   scopes: ['external']
    // }
  })
}
