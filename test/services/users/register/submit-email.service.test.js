// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import SubmitEmailService from '../../../../src/services/users/register/submit-email.service.js'

describe('Users - Register - Submit Email service', () => {
  let payload
  let session

  beforeEach(() => {
    session = SessionModelStub({})

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called with a valid payload', () => {
    beforeEach(() => {
      payload = { confirmEmail: 'licences@bigfarm.co.uk', email: 'Licences@BigFarm.co.uk' }
    })

    it('saves the submitted values', async () => {
      await SubmitEmailService(session.id, payload)

      expect(session.confirmEmail).toEqual('licences@bigfarm.co.uk')
      expect(session.email).toEqual('licences@bigfarm.co.uk')
      expect(session.$update).toHaveBeenCalled()
    })

    it('redirects to the check email page', async () => {
      const result = await SubmitEmailService(session.id, payload)

      expect(result).toEqual({
        redirectUrl: `/ext/users/register/${session.id}/check-email`
      })
    })
  })

  describe('when validation fails', () => {
    beforeEach(() => {
      payload = { confirmEmail: 'water@bigfarm.co.uk', email: 'licences@bigfarm.co.uk' }
    })

    it('does not save the submitted values', async () => {
      await SubmitEmailService(session.id, payload)

      expect(session.$update).not.toHaveBeenCalled()
    })

    it('returns page data for the view, with errors', async () => {
      const result = await SubmitEmailService(session.id, payload)

      expect(result).toEqual({
        backLink: {
          href: '/ext/users/register',
          text: 'Back'
        },
        confirmEmail: 'water@bigfarm.co.uk',
        email: 'licences@bigfarm.co.uk',
        error: {
          confirmEmail: {
            text: 'Email addresses must match'
          },
          errorList: [
            {
              href: '#confirmEmail',
              text: 'Email addresses must match'
            }
          ]
        },
        pageTitle: 'Enter your email address',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
