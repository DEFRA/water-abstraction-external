/**
 * Validates data submitted for the '/users/register/{sessionId}/create-password' page
 *
 * @module CreatePasswordValidator
 */

import Joi from 'water-abstraction-engine/wrappers/joi.wrapper.js'

const MIN_LENGTH = 8
const MIN_LENGTH_MESSAGE = `Your password must be at least ${MIN_LENGTH} characters long`
const PASSWORDS_MATCH_MESSAGE = 'Passwords must match'
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
const UPPERCASE_REGEX = /[A-Z]/

/**
 * Validates data submitted for the '/users/register/{sessionId}/create-password' page
 *
 * The rules match the legacy create password page. The password must be at least 8 characters long, and contain an
 * uppercase character and a symbol. The confirmed password must match it.
 *
 * We have changed some legacy behaviour:
 *
 * - The password is required. Legacy does not mark it as required, so a request without one passes validation and the
 * user's reset GUID is cleared without a password being set. A missing password now fails with the same message as an
 * empty one
 * - The password and the confirmed password are checked together. Legacy only checks they match once the password is
 * valid, so the user could fix one error only to be shown another
 * - The length is checked before the uppercase character and the symbol, so the first error shown matches the order of
 * the hint. Legacy checks the uppercase character first
 * - Legacy's uppercase message reads 'must be contain'. We have corrected it to 'must contain'
 *
 * @param {object} payload - The payload from the request to be validated
 *
 * @returns {object} the result from calling Joi's schema.validate(). It will be an object with a `value:` property. If
 * any errors are found the `error:` property will also exist detailing what the issues were
 */
export default function createPasswordValidator(payload) {
  const schema = Joi.object({
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
      'any.only': PASSWORDS_MATCH_MESSAGE,
      'any.required': PASSWORDS_MATCH_MESSAGE,
      'string.empty': PASSWORDS_MATCH_MESSAGE
    }),
    password: Joi.string()
      .required()
      .min(MIN_LENGTH)
      .rule({ message: MIN_LENGTH_MESSAGE })
      .pattern(UPPERCASE_REGEX)
      .rule({ message: 'Your password must contain an uppercase character' })
      .pattern(SYMBOL_REGEX)
      .rule({ message: 'Your password must contain a symbol character' })
      .messages({
        'any.required': MIN_LENGTH_MESSAGE,
        'string.empty': MIN_LENGTH_MESSAGE
      })
  })

  return schema.validate(payload, { abortEarly: false })
}
