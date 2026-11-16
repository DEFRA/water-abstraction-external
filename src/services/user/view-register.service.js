/**
 * Orchestrates presenting the data needed for the `/user/register` page
 * @module ViewRegisterService
 */

import RegisterPresenter from '../../presenters/user/register.presenter.js'

/**
 * Orchestrates presenting the data needed for the `/user/register` page
 *
 * @returns {object} The data formatted for the view template
 */
export default function viewRegisterService() {
  const pageData = RegisterPresenter()

  return {
    ...pageData
  }
}
