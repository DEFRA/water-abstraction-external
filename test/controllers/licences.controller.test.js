// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import Boom from 'water-abstraction-engine/wrappers/boom.wrapper.js'
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import http2 from 'node:http2'
import { yesterday } from 'water-abstraction-engine/test/general.js'
import { generateLicenceRef, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as ViewLicenceService from '../../src/services/licences/view-licence.service.js'

// For running our service
import { init } from '../../src/server.js'

const { HTTP_STATUS_OK, HTTP_STATUS_NOT_FOUND } = http2.constants

describe('Licences controller', () => {
  let licence
  let options
  let server

  // Create server before running the tests
  beforeAll(async () => {
    server = await init()
  })

  beforeEach(async () => {
    // We silence any calls to server.logger made in the plugin to try and keep the test output as clean as possible
    LoggerStub(server.logger)

    // We silence sending a notification to our Errbit instance using Airbrake
    vi.spyOn(server.app.airbrake, 'notify').mockResolvedValue(undefined)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('/licences/{id}', () => {
    describe('GET', () => {
      beforeEach(() => {
        licence = {
          pageTitle: `Licence summary ${generateLicenceRef()}`,
          pageTitleCaption: 'Unregistered licence',
          startDate: yesterday(),
          issueDate: yesterday(),
          waterUndertaker: false,
          regions: {
            historicalAreaCode: 'KAEA',
            regionalChargeArea: 'Southern',
            standardUnitChargeCode: 'SUCSO',
            localEnvironmentAgencyPlanCode: 'LEME'
          }
        }

        options = {
          method: 'GET',
          url: `/licences/${generateUUID()}`,
          auth: {
            strategy: 'session',
            credentials: {
              permission: { manageAccess: false, manageReturns: false },
              scope: ['user']
            }
          }
        }
      })

      describe('when the licence is linked to the user', () => {
        beforeEach(() => {
          vi.spyOn(ViewLicenceService, 'default').mockResolvedValue(licence)
        })

        it('returns the page successfully', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_OK)
          expect(response.payload).toContain(licence.pageTitle)
        })
      })

      describe('when the licence is not linked to the user', () => {
        beforeEach(() => {
          vi.spyOn(ViewLicenceService, 'default').mockRejectedValue(Boom.notFound('Licence not linked to user'))
        })

        it('returns a 404 error', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_NOT_FOUND)
        })
      })
    })
  })
})
