// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import { generateUserId, generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as FetchUserAuthDetails from '../../../src/dal/users/fetch-user-auth-details.dal.js'

// Thing under test
import AuthService from '../../../src/services/plugins/auth.service.js'

describe('Plugins - Auth Service', () => {
  // water-abstraction-engine passes the request to the apps in case it is needed, but in external we don't
  const request = {}

  let session
  let user

  beforeEach(() => {
    session = {
      userId: generateUserId(),
      company: { id: generateUUID(), name: 'ACME Water Ltd' }
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the user is "valid" (they exist)', () => {
    beforeEach(() => {
      user = {
        id: generateUUID(),
        licenceEntityId: generateUUID(),
        username: 'external@example.com',
        licenceEntity: {
          id: generateUUID(),
          licenceEntityRoles: []
        }
      }
    })

    describe('but are not linked to any licences (have no roles)', () => {
      beforeEach(() => {
        vi.spyOn(FetchUserAuthDetails, 'default').mockResolvedValue(user)
      })

      it('returns the user details with an empty scope and no permissions', async () => {
        const result = await AuthService(request, session)

        expect(result).toEqual({
          isValid: true,
          credentials: {
            permission: { manageAccess: false, manageReturns: false },
            scope: [],
            user
          }
        })
      })
    })

    describe('and are linked to licences', () => {
      describe('as a "Basic access" user', () => {
        beforeEach(() => {
          user.licenceEntity.licenceEntityRoles.push({
            id: generateUUID(),
            companyEntityId: session.company.id,
            role: 'user'
          })

          vi.spyOn(FetchUserAuthDetails, 'default').mockResolvedValue(user)
        })

        it('returns the user details with the correct scope and permissions', async () => {
          const result = await AuthService(request, session)

          expect(result).toEqual({
            isValid: true,
            credentials: {
              permission: { manageAccess: false, manageReturns: false },
              scope: ['user'],
              user
            }
          })
        })
      })

      describe('as a "Returns" user', () => {
        beforeEach(() => {
          user.licenceEntity.licenceEntityRoles.push({
            id: generateUUID(),
            companyEntityId: session.company.id,
            role: 'user_returns'
          })

          vi.spyOn(FetchUserAuthDetails, 'default').mockResolvedValue(user)
        })

        it('returns the user details with the correct scope and permissions', async () => {
          const result = await AuthService(request, session)

          expect(result).toEqual({
            isValid: true,
            credentials: {
              permission: { manageAccess: false, manageReturns: true },
              scope: ['user_returns'],
              user
            }
          })
        })
      })

      describe('as a "Returns" user', () => {
        beforeEach(() => {
          // NOTE: When a user is a primary user, they typically also have a "user_returns" role, so we add both here to
          // test that the service correctly handles multiple roles.
          user.licenceEntity.licenceEntityRoles.push({
            id: generateUUID(),
            companyEntityId: session.company.id,
            role: 'user_returns'
          })

          user.licenceEntity.licenceEntityRoles.push({
            id: generateUUID(),
            companyEntityId: session.company.id,
            role: 'primary_user'
          })

          vi.spyOn(FetchUserAuthDetails, 'default').mockResolvedValue(user)
        })

        it('returns the user details with the correct scope and permissions', async () => {
          const result = await AuthService(request, session)

          expect(result).toEqual({
            isValid: true,
            credentials: {
              permission: { manageAccess: true, manageReturns: true },
              scope: ['user_returns', 'primary_user'],
              user
            }
          })
        })
      })
    })
  })
})
