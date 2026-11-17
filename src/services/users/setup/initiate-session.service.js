/**
 * Initiates the session record used for setting up a new user
 * @module InitiateSessionService
 */

import CreateSessionDal from 'water-abstraction-engine/dal/create-session.dal.js'

/**
 * Initiates the session record used for setting up a new user
 *
 * @returns {Promise<module:SessionModel>} the newly created session record
 */
export default async function initiateSessionService() {
  return CreateSessionDal()
}
