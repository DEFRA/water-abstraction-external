// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import * as UpdatePasswordDal from '../../../../src/dal/users/update-password.dal.js'

// Thing under test
import SubmitCreatePasswordService from '../../../../src/services/users/register/submit-create-password.service.js'

describe('Users - Register - Submit Create Password service', () => {
  let payload
  let session
  let updatePasswordStub

  beforeEach(() => {
    session = SessionModelStub({ user: { id: 1234 } })

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
    updatePasswordStub = vi.spyOn(UpdatePasswordDal, 'default').mockResolvedValue()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when called with a valid payload', () => {
    beforeEach(() => {
      payload = { confirmPassword: 'Password1!', password: 'Password1!' }
    })

    it('saves the password for the user in the session', async () => {
      await SubmitCreatePasswordService(session.id, payload)

      expect(updatePasswordStub).toHaveBeenCalledWith(1234, 'Password1!')
    })

    it('redirects to the sign in page', async () => {
      const result = await SubmitCreatePasswordService(session.id, payload)

      expect(result).toEqual({
        redirectUrl: '/signin'
      })
    })
  })

  describe('when validation fails', () => {
    beforeEach(() => {
      payload = { confirmPassword: 'Password2!', password: 'Password1!' }
    })

    it('does not save the password', async () => {
      await SubmitCreatePasswordService(session.id, payload)

      expect(updatePasswordStub).not.toHaveBeenCalled()
    })

    it('returns page data for the view, with errors', async () => {
      const result = await SubmitCreatePasswordService(session.id, payload)

      expect(result).toEqual({
        confirmPassword: 'Password2!',
        error: {
          confirmPassword: {
            text: 'Passwords must match'
          },
          errorList: [
            {
              href: '#confirmPassword',
              text: 'Passwords must match'
            }
          ]
        },
        pageTitle: 'Create a password',
        password: 'Password1!'
      })
    })
  })
})
