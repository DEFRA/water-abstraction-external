/**
 * Validates data submitted for the '/users/register/{sessionId}/email' page
 *
 * @module EmailValidator
 */

import Joi from 'water-abstraction-engine/wrappers/joi.wrapper.js'

const MAX_LENGTH = 254

/**
 * Validates data submitted for the '/users/register/{sessionId}/email' page
 *
 * @param {object} payload - The payload from the request to be validated
 *
 * @returns {object} the result from calling Joi's schema.validate(). It will be an object with a `value:` property. If
 * any errors are found the `error:` property will also exist detailing what the issues were
 */
export default function emailValidator(payload) {
  const schema = Joi.object({
    email: Joi.string()
      .max(MAX_LENGTH)
      .email()
      .required()
      .messages({
        'any.required': 'Enter your email address',
        'string.email': 'Enter an email address in the right format, for example, name@example.com',
        'string.empty': 'Enter your email address',
        'string.max': `Email address must be ${MAX_LENGTH} characters or less`
      }),
    confirmEmail: Joi.string().empty('').required().valid(Joi.ref('email')).insensitive().messages({
      'any.only': 'Email addresses must match',
      'any.required': 'Confirm your email address'
    })
  })

  return schema.validate(payload, { abortEarly: false })
}
