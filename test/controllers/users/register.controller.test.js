// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import { postRequestOptions } from 'water-abstraction-engine/test/general.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as InitiateSessionService from '../../../src/services/users/register/initiate-session.service.js'
import * as SubmitCreatePasswordService from '../../../src/services/users/register/submit-create-password.service.js'
import * as SubmitEmailService from '../../../src/services/users/register/submit-email.service.js'
import * as ViewCheckEmailService from '../../../src/services/users/register/view-check-email.service.js'
import * as ViewCreatePasswordService from '../../../src/services/users/register/view-create-password.service.js'
import * as ViewEmailService from '../../../src/services/users/register/view-email.service.js'
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

  describe('/users/register/{sessionId}/check-email', () => {
    let sessionId

    beforeEach(() => {
      sessionId = generateUUID()
    })

    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: `/users/register/${sessionId}/check-email`
        }

        vi.spyOn(ViewCheckEmailService, 'default').mockResolvedValue({
          email: 'licences@bigfarm.co.uk',
          pageTitle: 'Confirm your email address',
          sendAgainLink: '/send-again'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Confirm your email address')
        expect(response.payload).toContain('licences@bigfarm.co.uk')
      })
    })
  })

  describe('/users/register/{sessionId}/create-password', () => {
    let sessionId

    beforeEach(() => {
      sessionId = generateUUID()
    })

    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: `/users/register/${sessionId}/create-password`
        }

        vi.spyOn(ViewCreatePasswordService, 'default').mockReturnValue({
          pageTitle: 'Create a password'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Create a password')
      })
    })

    describe('POST', () => {
      beforeEach(() => {
        options = postRequestOptions(`/users/register/${sessionId}/create-password`, {}, null)

        vi.spyOn(SubmitCreatePasswordService, 'default').mockReturnValue({
          redirectUrl: `/ext/users/register/${sessionId}/account-created`
        })
      })

      it('redirects to the account created page', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
        expect(response.headers.location).toEqual(`/ext/users/register/${sessionId}/account-created`)
      })
    })
  })

  describe('/users/register/{sessionId}/email', () => {
    let sessionId

    beforeEach(() => {
      sessionId = generateUUID()
    })

    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: `/users/register/${sessionId}/email`
        }

        vi.spyOn(ViewEmailService, 'default').mockResolvedValue({
          pageTitle: 'Create an account'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Create an account')
      })
    })

    describe('POST', () => {
      beforeEach(() => {
        options = postRequestOptions(`/users/register/${sessionId}/email`, {}, null)
      })

      describe('when a request is valid', () => {
        beforeEach(() => {
          vi.spyOn(SubmitEmailService, 'default').mockResolvedValue({
            redirectUrl: `/ext/users/register/${sessionId}/check-email`
          })
        })

        it('redirects to the check email page', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
          expect(response.headers.location).toEqual(`/ext/users/register/${sessionId}/check-email`)
        })
      })

      describe('when a request is invalid', () => {
        beforeEach(() => {
          vi.spyOn(SubmitEmailService, 'default').mockResolvedValue({
            error: {
              errorList: [
                { href: '#email', text: 'Enter an email address in the right format, for example, name@example.com' }
              ]
            },
            pageTitle: 'Create an account'
          })
        })

        it('re-renders the page with an error message', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_OK)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Enter an email address in the right format')
        })
      })
    })
  })
})
