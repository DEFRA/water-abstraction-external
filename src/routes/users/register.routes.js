/**
 * Routes for the /users/register endpoints
 *
 * @module UserRegisterRoutes
 */

import {
  setup,
  setupCreatePassword,
  submitCreatePassword,
  submitEmail,
  viewCheckEmail,
  viewCreatePassword,
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
      handler: setupCreatePassword
    },
    path: '/users/register/setup/create-password/{resetGuid}'
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
      handler: viewCheckEmail
    },
    path: '/users/register/{sessionId}/check-email'
  },
  {
    method: 'GET',
    options: {
      auth: false,
      handler: viewCreatePassword
    },
    path: '/users/register/{sessionId}/create-password'
  },
  {
    method: 'POST',
    options: {
      auth: false,
      handler: submitCreatePassword
    },
    path: '/users/register/{sessionId}/create-password'
  }
]
