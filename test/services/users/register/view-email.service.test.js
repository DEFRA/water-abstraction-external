// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewEmailService from '../../../../src/services/users/register/view-email.service.js'

describe('Users - Register - View Email service', () => {
  let session

  beforeEach(() => {
    session = SessionModelStub({})

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called', () => {
    it('returns page data for the view', async () => {
      const result = await ViewEmailService(session.id)

      expect(result).toEqual({
        backLink: {
          href: '/ext/users/register',
          text: 'Back'
        },
        email: null,
        pageTitle: 'Enter your email address',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
