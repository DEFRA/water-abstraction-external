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
 * out of date. This matches the legacy `getUserByResetGuid` lookup.
 *
 * The user's `username` (their email address) is returned so it can be saved to the session along with their ID. The
 * `resetGuidCreatedAt` is returned as well, so the caller can check whether the link has expired.
 *
 * The `reset_guid` column is a string, so a value that is not a valid GUID can be passed in safely. It just will not
 * match a user.
 *
 * @param {string} resetGuid - The reset GUID from the emailed link
 *
 * @returns {Promise<object|undefined>} the ID and username of the matching user and when their reset GUID was created,
 * or undefined if none exists
 */
export default async function fetchUserByResetGuidDal(resetGuid) {
  return UserModel.query()
    .select(['id', 'resetGuidCreatedAt', 'username'])
    .where('resetGuid', resetGuid)
    .where('application', 'water_vml')
    .limit(1)
    .first()
}
