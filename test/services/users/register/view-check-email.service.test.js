// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewCheckEmailService from '../../../../src/services/users/register/view-check-email.service.js'

describe('Users - Register - View Check Email service', () => {
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
      const result = await ViewCheckEmailService(session.id)

      expect(result).toEqual({
        email: 'licences@bigfarm.co.uk',
        pageTitle: 'Check your email',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
