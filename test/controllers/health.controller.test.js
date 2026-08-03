// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'
import http2 from 'node:http2'

// Things we need to stub
import * as ViewInfoService from '../../src/services/health/view-info.service.js'

// For running our service
import { init } from '../../src/server.js'

const { HTTP_STATUS_OK } = http2.constants

describe('Health controller', () => {
  let info
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

  describe('/health/info', () => {
    describe('GET', () => {
      beforeEach(() => {
        info = {
          pageTitle: 'Info',
          pageTitleCaption: 'Service information',
          appData: {
            commit: generateUUID(),
            name: 'External',
            serviceName: 'external',
            version: '1.0.0'
          },
          notifyData: 'Up and running'
        }

        options = {
          method: 'GET',
          url: `/health/info`
        }
      })

      describe('when the request succeeds', () => {
        beforeEach(() => {
          vi.spyOn(ViewInfoService, 'default').mockResolvedValue(info)
        })

        it('returns the page successfully', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_OK)
          expect(response.payload).toContain(info.pageTitle)
        })
      })
    })
  })
})
