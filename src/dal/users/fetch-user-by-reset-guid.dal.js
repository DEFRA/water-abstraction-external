/**
 * Fetch an external user by their reset GUID
 * @module FetchUserByResetGuidDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'

/**
 * Fetch an external user by their reset GUID
 *
 * The reset GUID is in the link we email the user to create or reset their password. It is cleared once the password
 * has been set, and replaced when a newer email is sent. So if no user is found, the link has already been used or is
 * out of date. This matches the legacy `getUserByResetGuid` lookup, which also does not check the age of the GUID.
 *
 * The `reset_guid` column is a string, so a value that is not a valid GUID can be passed in safely. It just will not
 * match a user.
 *
 * @param {string} resetGuid - The reset GUID from the emailed link
 *
 * @returns {Promise<object|undefined>} the ID of the matching user, or undefined if none exists
 */
export default async function fetchUserByResetGuidDal(resetGuid) {
  return UserModel.query()
    .select(['id'])
    .where('resetGuid', resetGuid)
    .where('application', 'water_vml')
    .limit(1)
    .first()
}
