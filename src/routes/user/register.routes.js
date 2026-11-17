/**
 * Routes for the /user/register endpoints
 *
 * @module UserRegisterRoutes
 */

import { viewRegister } from '../../controllers/user/register.controller.js'

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
