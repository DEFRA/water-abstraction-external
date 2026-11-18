// Test framework
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import http2 from 'node:http2'
import LoggerStub from 'water-abstraction-engine/test/stubs/logger.stub.js'
import { postRequestOptions } from 'water-abstraction-engine/test/general.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as InitiateSessionService from '../../../src/services/users/register/initiate-session.service.js'
import * as SubmitCancelService from '../../../src/services/users/register/submit-cancel.service.js'
import * as SubmitCheckService from '../../../src/services/users/register/submit-check.service.js'
import * as SubmitEmailService from '../../../src/services/users/register/submit-email.service.js'
import * as ViewCancelService from '../../../src/services/users/register/view-cancel.service.js'
import * as ViewCheckService from '../../../src/services/users/register/view-check.service.js'
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

  describe('/users/register/{sessionId}/cancel', () => {
    let sessionId

    beforeEach(() => {
      sessionId = generateUUID()
    })

    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: `/users/register/${sessionId}/cancel`
        }

        vi.spyOn(ViewCancelService, 'default').mockResolvedValue({
          backLink: { href: `/ext/users/register/${sessionId}/check`, text: 'Back' },
          email: 'licences@bigfarm.co.uk',
          pageTitle: 'You are about to cancel creating an account',
          pageTitleCaption: 'Create an account'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('You are about to cancel creating an account')
        expect(response.payload).toContain('licences@bigfarm.co.uk')
      })
    })

    describe('POST', () => {
      beforeEach(() => {
        options = postRequestOptions(`/users/register/${sessionId}/cancel`, {}, null)

        vi.spyOn(SubmitCancelService, 'default').mockResolvedValue({ redirectUrl: '/welcome' })
      })

      it('redirects to the welcome page', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
        expect(response.headers.location).toEqual('/welcome')
      })
    })
  })

  describe('/users/register/{sessionId}/check', () => {
    let sessionId

    beforeEach(() => {
      sessionId = generateUUID()
    })

    describe('GET', () => {
      beforeEach(() => {
        options = {
          method: 'GET',
          url: `/users/register/${sessionId}/check`
        }

        vi.spyOn(ViewCheckService, 'default').mockResolvedValue({
          email: 'licences@bigfarm.co.uk',
          links: {
            cancel: `/ext/users/register/${sessionId}/cancel`,
            email: `/ext/users/register/${sessionId}/email`
          },
          pageTitle: 'Check your details',
          pageTitleCaption: 'Create an account'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Check your details')
        expect(response.payload).toContain('licences@bigfarm.co.uk')
      })
    })

    describe('POST', () => {
      beforeEach(() => {
        options = postRequestOptions(`/users/register/${sessionId}/check`, {}, null)

        vi.spyOn(SubmitCheckService, 'default').mockReturnValue({
          redirectUrl: `/ext/users/register/${sessionId}/check-email`
        })
      })

      it('redirects to the check email page', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
        expect(response.headers.location).toEqual(`/ext/users/register/${sessionId}/check-email`)
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
          pageTitle: 'Enter your email address'
        })
      })

      it('returns the page successfully', async () => {
        const response = await server.inject(options)

        expect(response.statusCode).toEqual(HTTP_STATUS_OK)
        expect(response.payload).toContain('Enter your email address')
      })
    })

    describe('POST', () => {
      beforeEach(() => {
        options = postRequestOptions(`/users/register/${sessionId}/email`, {}, null)
      })

      describe('when a request is valid', () => {
        beforeEach(() => {
          vi.spyOn(SubmitEmailService, 'default').mockResolvedValue({
            redirectUrl: `/ext/users/register/${sessionId}/check`
          })
        })

        it('redirects to the check page', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_FOUND)
          expect(response.headers.location).toEqual(`/ext/users/register/${sessionId}/check`)
        })
      })

      describe('when a request is invalid', () => {
        beforeEach(() => {
          vi.spyOn(SubmitEmailService, 'default').mockResolvedValue({
            error: {
              errorList: [{ href: '#email', text: 'Enter your email address' }]
            },
            pageTitle: 'Enter your email address'
          })
        })

        it('re-renders the page with an error message', async () => {
          const response = await server.inject(options)

          expect(response.statusCode).toEqual(HTTP_STATUS_OK)
          expect(response.payload).toContain('There is a problem')
          expect(response.payload).toContain('Enter your email address')
        })
      })
    })
  })
})
