/**
 * Routes for the /users/register endpoints
 *
 * @module UserRegisterRoutes
 */

import {
  setup,
  submitCheck,
  submitEmail,
  viewCheck,
  viewEmail,
  viewRegister
} from '../../controllers/users/register.controller.js'

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
  },
  {
    method: 'GET',
    options: {
      auth: false,
      handler: viewEmail
    },
    path: '/users/register/{sessionId}/email'
  },
  {
    method: 'POST',
    options: {
      auth: false,
      handler: submitEmail
    },
    path: '/users/register/{sessionId}/email'
  },
  {
    method: 'GET',
    options: {
      auth: false,
      handler: viewCheck
    },
    path: '/users/register/{sessionId}/check'
  },
  {
    method: 'POST',
    options: {
      auth: false,
      handler: submitCheck
    },
    path: '/users/register/{sessionId}/check'
  }
]
