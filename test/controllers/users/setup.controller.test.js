// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as InitiateSessionService from '../../../src/services/users/setup/initiate-session.service.js'

// For running our service
import { init } from '../../../src/server.js'

const { HTTP_STATUS_FOUND } = http2.constants

describe('Users setup controller', () => {
  let options
  let server
  let sessionId

  // Create server before running the tests
  beforeAll(async () => {
    server = await init()
  })

  beforeEach(async () => {
    // We silence any calls to server.logger made in the plugin to try and keep the test output as clean as possible
    LoggerStub(server.logger)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  afterAll(async () => {
    await server.stop()
  })

  describe('/users/setup', () => {
    describe('GET', () => {
      beforeEach(() => {
        sessionId = generateUUID()

        options = {
          method: 'GET',
          url: '/users/setup'
        }

        vi.spyOn(InitiateSessionService, 'default').mockResolvedValue({ id: sessionId })
      })

      it('redirects to the email address page', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
        expect(response.headers.location).toEqual(`/ext/users/setup/${sessionId}/email-address`)
      })
    })
  })
})
