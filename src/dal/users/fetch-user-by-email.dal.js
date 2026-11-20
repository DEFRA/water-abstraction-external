/**
 * Fetch an external user by their email address
 * @module FetchUserByEmailDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'

/**
 * Fetch an external user by their email address
 *
 * @param {string} email - The email address (username) of the user
 *
 * @returns {Promise<object|undefined>} the ID of the matching user, or undefined if none exists
 */
export default async function fetchUserByEmailDal(email) {
  return UserModel.query().select(['id']).where('username', email).where('application', 'water_vml').limit(1).first()
}
