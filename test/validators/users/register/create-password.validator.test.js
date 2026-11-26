// Test framework
import { describe, expect, it } from 'vitest'

// Thing under test
import CreatePasswordValidator from '../../../../src/validators/users/register/create-password.validator.js'

describe('Users - Register - Create Password validator', () => {
  describe('when valid data is provided', () => {
    it('confirms the data is valid', () => {
      const result = CreatePasswordValidator({ confirmPassword: 'Password1!', password: 'Password1!' })

      expect(result.value).toEqual({ confirmPassword: 'Password1!', password: 'Password1!' })
      expect(result.error).toBeUndefined()
    })
  })

  describe('when invalid data is provided', () => {
    describe('because no password was entered', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({})

        expect(result.error.details[0].message).toEqual('Your password must be at least 8 characters long')
        expect(result.error.details[0].path[0]).toEqual('password')
        expect(result.error.details[1].message).toEqual('Passwords must match')
        expect(result.error.details[1].path[0]).toEqual('confirmPassword')
      })
    })

    describe('because an empty password was entered', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: '', password: '' })

        expect(result.error.details[0].message).toEqual('Your password must be at least 8 characters long')
        expect(result.error.details[0].path[0]).toEqual('password')
      })
    })

    describe('because the password is too short', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: 'Pass1!', password: 'Pass1!' })

        expect(result.error.details[0].message).toEqual('Your password must be at least 8 characters long')
        expect(result.error.details[0].path[0]).toEqual('password')
      })
    })

    describe('because the password has no uppercase character', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: 'password1!', password: 'password1!' })

        expect(result.error.details[0].message).toEqual('Your password must contain an uppercase character')
        expect(result.error.details[0].path[0]).toEqual('password')
      })
    })

    describe('because the password has no symbol', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: 'Password1', password: 'Password1' })

        expect(result.error.details[0].message).toEqual('Your password must contain a symbol character')
        expect(result.error.details[0].path[0]).toEqual('password')
      })
    })

    describe('because the passwords do not match', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: 'Password2!', password: 'Password1!' })

        expect(result.error.details[0].message).toEqual('Passwords must match')
        expect(result.error.details[0].path[0]).toEqual('confirmPassword')
      })
    })

    describe('because the password was not confirmed', () => {
      it('fails validation', () => {
        const result = CreatePasswordValidator({ confirmPassword: '', password: 'Password1!' })

        expect(result.error.details[0].message).toEqual('Passwords must match')
        expect(result.error.details[0].path[0]).toEqual('confirmPassword')
      })
    })
  })
})
