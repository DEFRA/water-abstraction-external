// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import EmailValidator from '../../../../src/validators/users/register/email.validator.js'

describe('Users - Register - Email validator', () => {
  describe('when valid data is provided', () => {
    it('confirms the data is valid', () => {
      const result = EmailValidator({ email: 'licences@bigfarm.co.uk' })

      expect(result.value).toEqual({ email: 'licences@bigfarm.co.uk' })
      expect(result.error).toBeUndefined()
    })
  })

  describe('when invalid data is provided', () => {
    describe('because no email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({})

        expect(result.error.details[0].message).toEqual('Enter your email address')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because an empty email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({ email: '' })

        expect(result.error.details[0].message).toEqual('Enter your email address')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because the email address is not in the right format', () => {
      it('fails validation', () => {
        const result = EmailValidator({ email: 'big.farm' })

        expect(result.error.details[0].message).toEqual(
          'Enter an email address in the right format, for example, name@example.com'
        )
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because the email address is too long', () => {
      it('fails validation', () => {
        const result = EmailValidator({ email: `${'a'.repeat(250)}@bigfarm.co.uk` })

        expect(result.error.details[0].message).toEqual('Email address must be 254 characters or less')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })
  })
})
