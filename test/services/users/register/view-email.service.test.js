// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'
import YarStub from 'water-abstraction-engine/test/stubs/yar.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewEmailService from '../../../../src/services/users/register/view-email.service.js'

describe('Users - Register - View Email service', () => {
  let session
  let yarStub

  beforeEach(() => {
    session = SessionModelStub({})

    yarStub = YarStub()
    yarStub.flash.mockReturnValue([])

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns page data for the view', async () => {
      const result = await ViewEmailService(session.id, yarStub)

      expect(result).toEqual({
        backLink: {
          href: '/ext/users/register',
          text: 'Back'
        },
        email: null,
        notification: undefined,
        pageTitle: 'Create an account'
      })
    })

    describe('and there is a notification to be displayed', () => {
      let notification

      beforeEach(() => {
        notification = {
          text: 'Links only work for 48 hours, and only the most recent link we sent works.',
          titleText: 'Link expired'
        }

        yarStub.flash.mockReturnValue([notification])
      })

      it('returns the notification', async () => {
        const result = await ViewEmailService(session.id, yarStub)

        expect(yarStub.flash).toHaveBeenCalledWith('notification')
        expect(result.notification).toEqual(notification)
      })
    })
  })
})
