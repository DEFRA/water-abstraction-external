/**
 * Routes for the /licences endpoints
 *
 * @module LicencesRoutes
 */

import { viewLicence } from '../controllers/licences.controller.js'

export default [
  {
    handler: viewLicence,
    method: 'GET',
    path: '/licences/{id}'
  }
]
