/**
 * Routes for the /users/register endpoints
 *
 * @module UserRegisterRoutes
 */

import { setup, viewRegister } from '../../controllers/users/register.controller.js'

export default [
  {
    method: 'GET',
    options: {
      auth: false,
      handler: viewRegister
    },
    path: '/users/register'
  },
  {
    method: 'GET',
    options: {
      auth: false,
      handler: setup
    },
    path: '/users/register/setup'
  }
]
