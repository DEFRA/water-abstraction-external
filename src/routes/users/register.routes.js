/**
 * Routes for the /users/register endpoints
 *
 * @module UserRegisterRoutes
 */

import { viewRegister } from '../../controllers/users/register.controller.js'

export default [
  {
    method: 'GET',
    options: {
      auth: false,
      handler: viewRegister
    },
    path: '/users/register'
  }
]
