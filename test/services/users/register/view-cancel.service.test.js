// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewCancelService from '../../../../src/services/users/register/view-cancel.service.js'

describe('Users - Register - View Cancel service', () => {
  let session

  beforeEach(() => {
    session = SessionModelStub({ email: 'licences@bigfarm.co.uk' })

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns page data for the view', async () => {
      const result = await ViewCancelService(session.id)

      expect(result).toEqual({
        backLink: {
          href: `/ext/users/register/${session.id}/check`,
          text: 'Back'
        },
        email: 'licences@bigfarm.co.uk',
        pageTitle: 'You are about to cancel creating an account',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
