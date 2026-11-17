/**
 * Orchestrates presenting the data needed for the `/users/register` page
 * @module ViewRegisterService
 */

import RegisterPresenter from '../../../presenters/users/register.presenter.js'

/**
 * Orchestrates presenting the data needed for the `/users/register` page
 *
 * @returns {object} The data formatted for the view template
 */
export default function viewRegisterService() {
  const pageData = RegisterPresenter()

  return {
    ...pageData
  }
}
