// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

// Thing under test
import ViewCreatePasswordService from '../../../../src/services/users/register/view-create-password.service.js'

describe('Users - Register - View Create Password service', () => {
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
      const result = await ViewCreatePasswordService(session.id)

      expect(result).toEqual({
        confirmPassword: null,
        pageTitle: 'Create a password',
        password: null
      })
    })
  })
})
