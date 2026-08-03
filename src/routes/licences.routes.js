import { viewLicence } from '../controllers/licences.controller.js'

export default [
  {
    method: 'GET',
    path: '/licences/{id}',
    handler: viewLicence
  }
]
