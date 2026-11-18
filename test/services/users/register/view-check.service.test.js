// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'
import YarStub from 'water-abstraction-engine/test/stubs/yar.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewCheckService from '../../../../src/services/users/register/view-check.service.js'

describe('Users - Register - View Check service', () => {
  let session
  let yarStub

  beforeEach(() => {
    session = SessionModelStub({ email: 'licences@bigfarm.co.uk' })

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)

    yarStub = YarStub()
    yarStub.flash.mockReturnValue([])
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns page data for the view', async () => {
      const result = await ViewCheckService(session.id, yarStub)

      expect(result).toEqual({
        email: 'licences@bigfarm.co.uk',
        links: {
          cancel: `/ext/users/register/${session.id}/cancel`,
          email: `/ext/users/register/${session.id}/email`
        },
        notification: undefined,
        pageTitle: 'Check your details',
        pageTitleCaption: 'Create an account'
      })
    })

    it('marks the check page as visited', async () => {
      await ViewCheckService(session.id, yarStub)

      expect(session.checkPageVisited).toBe(true)
      expect(session.$update).toHaveBeenCalled()
    })

    describe('and there is a flash notification', () => {
      beforeEach(() => {
        yarStub.flash.mockReturnValue([{ text: 'Email address updated', titleText: 'Updated' }])
      })

      it('returns the notification', async () => {
        const result = await ViewCheckService(session.id, yarStub)

        expect(result.notification).toEqual({ text: 'Email address updated', titleText: 'Updated' })
      })
    })
  })
})
