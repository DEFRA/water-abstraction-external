/**
 * Formats data for the `/user/register` page
 * @module RegisterPresenter
 */

/**
 * Formats data for the `/user/register` page
 *
 * @returns {object} The data formatted for the view template
 */
export default function registerPresenter() {
  return {
    backLink: {
      href: '/welcome',
      text: 'Back'
    },
    pageTitle: 'Create an account to manage your water abstraction licence online'
  }
}
