/**
 * Set a new reset GUID for a user
 * @module UpdateResetGuidDal
 */

import UserModel from 'water-abstraction-engine/models/user.model.js'
import { generateUUID } from 'water-abstraction-engine/lib/general.lib.js'

/**
 * Set a new reset GUID for a user
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
