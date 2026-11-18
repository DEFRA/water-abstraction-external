// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CheckPresenter from '../../../../src/presenters/users/register/check.presenter.js'

describe('Users - Register - Check presenter', () => {
  let session

  beforeEach(() => {
    session = { email: 'licences@bigfarm.co.uk', id: generateUUID() }
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = CheckPresenter(session)

      expect(result).toEqual({
        email: 'licences@bigfarm.co.uk',
        links: {
          cancel: `/ext/users/register/${session.id}/cancel`,
          email: `/ext/users/register/${session.id}/email`
        },
        pageTitle: 'Check your details',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
