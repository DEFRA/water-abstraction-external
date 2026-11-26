/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/create-password' page
 * @module ViewCreatePasswordService
 */

import CreatePasswordPresenter from '../../../presenters/users/register/create-password.presenter.js'

/**
 * Orchestrates fetching and presenting the data for the '/users/register/{sessionId}/create-password' page
 *
 * @returns {object} The data formatted for the view template
 */
export default function viewCreatePasswordService() {
  return CreatePasswordPresenter()
}
