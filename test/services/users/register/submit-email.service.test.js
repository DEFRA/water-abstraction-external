// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'
import YarStub from 'water-abstraction-engine/test/stubs/yar.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import SubmitEmailService from '../../../../src/services/users/register/submit-email.service.js'

describe('Users - Register - Submit Email service', () => {
  let payload
  let session
  let yarStub

  beforeEach(() => {
    session = SessionModelStub({})

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)

    yarStub = YarStub()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called with a valid payload', () => {
    beforeEach(() => {
      payload = { email: 'Licences@BigFarm.co.uk' }
    })

    it('saves the submitted value', async () => {
      await SubmitEmailService(session.id, payload, yarStub)

      expect(session.email).toEqual('licences@bigfarm.co.uk')
      expect(session.$update).toHaveBeenCalled()
    })

    it('redirects to the check page', async () => {
      const result = await SubmitEmailService(session.id, payload, yarStub)

      expect(result).toEqual({
        redirectUrl: `/ext/users/register/${session.id}/check`
      })
    })

    describe('and the check page has been visited', () => {
      beforeEach(() => {
        session = SessionModelStub({ checkPageVisited: true, email: 'licences@bigfarm.co.uk' })

        vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
      })

      describe('and the email address has not changed', () => {
        it('does not set a notification', async () => {
          await SubmitEmailService(session.id, payload, yarStub)

          expect(yarStub.flash).not.toHaveBeenCalled()
        })
      })

      describe('and the email address has changed', () => {
        beforeEach(() => {
          payload = { email: 'water@bigfarm.co.uk' }
        })

        it('sets a notification', async () => {
          await SubmitEmailService(session.id, payload, yarStub)

          const [flashType, bannerMessage] = yarStub.flash.mock.calls[0]

          expect(flashType).toEqual('notification')
          expect(bannerMessage).toEqual({ text: 'Email address updated', titleText: 'Updated' })
        })
      })
    })

    describe('and the check page has not been visited', () => {
      it('does not set a notification', async () => {
        await SubmitEmailService(session.id, payload, yarStub)

        expect(yarStub.flash).not.toHaveBeenCalled()
      })
    })
  })

  describe('when validation fails', () => {
    beforeEach(() => {
      payload = { email: 'big.farm' }
    })

    it('does not save the submitted value', async () => {
      await SubmitEmailService(session.id, payload, yarStub)

      expect(session.$update).not.toHaveBeenCalled()
    })

    it('returns page data for the view, with errors', async () => {
      const result = await SubmitEmailService(session.id, payload, yarStub)

      expect(result).toEqual({
        backLink: {
          href: '/ext/users/register',
          text: 'Back'
        },
        email: 'big.farm',
        error: {
          email: {
            text: 'Enter an email address in the right format, for example, name@example.com'
          },
          errorList: [
            {
              href: '#email',
              text: 'Enter an email address in the right format, for example, name@example.com'
            }
          ]
        },
        pageTitle: 'Enter your email address',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
