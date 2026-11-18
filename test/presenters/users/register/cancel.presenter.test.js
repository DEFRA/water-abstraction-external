// Test framework
import { beforeEach, describe, expect, it } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Thing under test
import CancelPresenter from '../../../../src/presenters/users/register/cancel.presenter.js'

describe('Users - Register - Cancel presenter', () => {
  let session

  beforeEach(() => {
    session = { email: 'licences@bigfarm.co.uk', id: generateUUID() }
  })

  describe('when called', () => {
    it('returns page data for the view', () => {
      const result = CancelPresenter(session)

      expect(result).toEqual({
        backLink: {
          href: `/ext/users/register/${session.id}/check`,
          text: 'Back'
        },
        email: 'licences@bigfarm.co.uk',
        pageTitle: 'You are about to cancel creating an account',
        pageTitleCaption: 'Create an account'
      })
    })
  })
})
