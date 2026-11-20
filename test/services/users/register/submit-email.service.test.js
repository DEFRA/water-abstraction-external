// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import SessionModelStub from 'water-abstraction-engine/test/stubs/session.stub.js'
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as FetchSessionDal from 'water-abstraction-engine/dal/fetch-session.dal.js'

import * as CreateUserDal from '../../../../src/dal/users/create-user.dal.js'
import * as FetchUserByEmailDal from '../../../../src/dal/users/fetch-user-by-email.dal.js'
import * as SendResetPasswordEmailService from '../../../../src/services/users/register/send-reset-password-email.service.js'
import * as SendVerificationEmailService from '../../../../src/services/users/register/send-verification-email.service.js'
import * as UpdateResetGuidDal from '../../../../src/dal/users/update-reset-guid.dal.js'

// Thing under test
import SubmitEmailService from '../../../../src/services/users/register/submit-email.service.js'

describe('Users - Register - Submit Email service', () => {
  const email = 'licences@bigfarm.co.uk'

  let createUserStub
  let fetchUserByEmailStub
  let payload
  let resetGuid
  let sendResetPasswordEmailStub
  let sendVerificationEmailStub
  let session
  let updateResetGuidStub

  beforeEach(() => {
    resetGuid = generateUUID()
    session = SessionModelStub({})

    vi.spyOn(FetchSessionDal, 'default').mockResolvedValue(session)
    createUserStub = vi.spyOn(CreateUserDal, 'default').mockResolvedValue({ resetGuid })
    fetchUserByEmailStub = vi.spyOn(FetchUserByEmailDal, 'default').mockResolvedValue(undefined)
    updateResetGuidStub = vi.spyOn(UpdateResetGuidDal, 'default').mockResolvedValue(resetGuid)
    sendResetPasswordEmailStub = vi.spyOn(SendResetPasswordEmailService, 'default').mockResolvedValue()
    sendVerificationEmailStub = vi.spyOn(SendVerificationEmailService, 'default').mockResolvedValue()
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

    describe('and no account exists for the email address', () => {
      it('looks up the user by the formatted email address', async () => {
        await SubmitEmailService(session.id, payload)

        expect(fetchUserByEmailStub).toHaveBeenCalledWith(email)
      })

      it('creates the user', async () => {
        await SubmitEmailService(session.id, payload)

        expect(createUserStub).toHaveBeenCalledWith(email)
      })

      it('sends the verification email', async () => {
        await SubmitEmailService(session.id, payload)

        expect(sendVerificationEmailStub).toHaveBeenCalledWith(email, resetGuid)
        expect(sendResetPasswordEmailStub).not.toHaveBeenCalled()
      })
    })

    describe('and an account already exists for the email address', () => {
      beforeEach(() => {
        fetchUserByEmailStub.mockResolvedValue({ id: 123 })
      })

      it('does not create the user', async () => {
        await SubmitEmailService(session.id, payload)

        expect(createUserStub).not.toHaveBeenCalled()
      })

      it('sets a new reset GUID and sends the reset password email', async () => {
        await SubmitEmailService(session.id, payload)

        expect(updateResetGuidStub).toHaveBeenCalledWith(123)
        expect(sendResetPasswordEmailStub).toHaveBeenCalledWith(email, resetGuid)
        expect(sendVerificationEmailStub).not.toHaveBeenCalled()
      })

      it('redirects to the check email page', async () => {
        const result = await SubmitEmailService(session.id, payload)

        expect(result).toEqual({
          redirectUrl: `/ext/users/register/${session.id}/check-email`
        })
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

    it('does not create the user or send an email', async () => {
      await SubmitEmailService(session.id, payload)

      expect(createUserStub).not.toHaveBeenCalled()
      expect(sendVerificationEmailStub).not.toHaveBeenCalled()
      expect(sendResetPasswordEmailStub).not.toHaveBeenCalled()
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
