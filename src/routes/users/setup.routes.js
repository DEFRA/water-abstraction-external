/**
 * Routes for the /users/setup endpoints
 *
 * @module UsersSetupRoutes
 */

import { setup } from '../../controllers/users/setup.controller.js'

export default [
  {
    method: 'GET',
    options: {
      auth: false,
      handler: setup
    },
    path: '/users/setup'
  }
]
