// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import EmailValidator from '../../../../src/validators/users/register/email.validator.js'

describe('Users - Register - Email validator', () => {
  describe('when valid data is provided', () => {
    it('confirms the data is valid', () => {
      const result = EmailValidator({ confirmEmail: 'licences@bigfarm.co.uk', email: 'licences@bigfarm.co.uk' })

      expect(result.value).toEqual({ confirmEmail: 'licences@bigfarm.co.uk', email: 'licences@bigfarm.co.uk' })
      expect(result.error).toBeUndefined()
    })

    describe('and the email addresses only differ by case', () => {
      it('confirms the data is valid', () => {
        const result = EmailValidator({ confirmEmail: 'licences@bigfarm.co.uk', email: 'Licences@BigFarm.co.uk' })

        expect(result.error).toBeUndefined()
      })
    })
  })

  describe('when invalid data is provided', () => {
    describe('because no email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({ confirmEmail: 'licences@bigfarm.co.uk' })

        expect(result.error.details[0].message).toEqual('Enter your email address')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because an empty email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({ confirmEmail: 'licences@bigfarm.co.uk', email: '' })

        expect(result.error.details[0].message).toEqual('Enter your email address')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because the email address is not in the right format', () => {
      it('fails validation', () => {
        const result = EmailValidator({ confirmEmail: 'big.farm', email: 'big.farm' })

        expect(result.error.details[0].message).toEqual(
          'Enter an email address in the right format, for example, name@example.com'
        )
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because the email address is too long', () => {
      it('fails validation', () => {
        const email = `${'a'.repeat(250)}@bigfarm.co.uk`

        const result = EmailValidator({ confirmEmail: email, email })

        expect(result.error.details[0].message).toEqual('Email address must be 254 characters or less')
        expect(result.error.details[0].path[0]).toEqual('email')
      })
    })

    describe('because no confirm email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({ email: 'licences@bigfarm.co.uk' })

        expect(result.error.details[0].message).toEqual('Confirm your email address')
        expect(result.error.details[0].path[0]).toEqual('confirmEmail')
      })
    })

    describe('because an empty confirm email address was entered', () => {
      it('fails validation', () => {
        const result = EmailValidator({ confirmEmail: '', email: 'licences@bigfarm.co.uk' })

        expect(result.error.details[0].message).toEqual('Confirm your email address')
        expect(result.error.details[0].path[0]).toEqual('confirmEmail')
      })
    })

    describe('because the email addresses do not match', () => {
      it('fails validation', () => {
        const result = EmailValidator({ confirmEmail: 'water@bigfarm.co.uk', email: 'licences@bigfarm.co.uk' })

        expect(result.error.details[0].message).toEqual('Email addresses must match')
        expect(result.error.details[0].path[0]).toEqual('confirmEmail')
      })
    })
  })
})
