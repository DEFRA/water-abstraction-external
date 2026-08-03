/**
 * Our router plugin which pulls in the various routes we have defined ready to be registered with the Hapi server
 * @module RouterPlugin
 */

import AirbrakeConfig from 'water-abstraction-engine/config/airbrake.config.js'
import FilterRoutesService from 'water-abstraction-engine/services/plugins/filter-routes.service.js'

import HealthRoutes from '../routes/health.routes.js'
import LicenceRoutes from '../routes/licences.routes.js'

const routes = [...HealthRoutes, ...LicenceRoutes]

export default {
  name: 'router-external',
  register: (server, _options) => {
    // Filter our any routes which should not be registered. Typically, these will be unfinished endpoints we filter
    // out when running in production
    const filteredRoutes = FilterRoutesService(routes, AirbrakeConfig.environment)

    server.route(filteredRoutes)
  }
}
