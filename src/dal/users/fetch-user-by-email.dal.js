/**
 * Fetch an external user by their email address
 * @module FetchUserByEmailDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'

/**
 * Fetch an external user by their email address
 *
 * The match ignores case, the same as the legacy IDM lookup. Some existing usernames were saved with capitals, and we
 * need to find those rather than create a second, lowercase account for the same person.
 *
 * @param {string} email - The email address (username) of the user
 *
 * @returns {Promise<object|undefined>} the ID and enabled flag of the matching user, or undefined if none exists
 */
export default async function fetchUserByEmailDal(email) {
  return UserModel.query()
    .select(['enabled', 'id'])
    .whereRaw('LOWER(username) = LOWER(?)', [email])
    .where('application', 'water_vml')
    .limit(1)
    .first()
}
