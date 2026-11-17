// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as InitiateSessionService from '../../../src/services/users/register/initiate-session.service.js'
import * as ViewRegisterService from '../../../src/services/users/register/view-register.service.js'

// For running our service
import { init } from '../../../src/server.js'

const { HTTP_STATUS_FOUND, HTTP_STATUS_OK } = http2.constants

describe('User register controller', () => {
  let options
  let server

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

  describe('/users/register', () => {
    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: '/users/register'
        }

        vi.spyOn(ViewRegisterService, 'default').mockReturnValue({
          backLink: { href: '/welcome', text: 'Back' },
          pageTitle: 'Create an account to manage your water abstraction licence online'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Create an account to manage your water abstraction licence online')
      })
    })
  })

  describe('/users/register/setup', () => {
    describe('GET', () => {
      let sessionId

      beforeEach(() => {
        sessionId = generateUUID()

        options = {
          method: 'GET',
          url: '/users/register/setup'
        }

        vi.spyOn(InitiateSessionService, 'default').mockResolvedValue({ id: sessionId })
      })

      it('redirects to the email page', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
        expect(response.headers.location).toEqual(`/ext/users/register/${sessionId}/email`)
      })
    })
  })
})
