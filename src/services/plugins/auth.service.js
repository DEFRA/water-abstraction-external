/**
 * Used by `AuthPlugin` to authenticate and authorise users
 * @module AuthService
 */

import FetchUserAuthDetailsDal from '../../dal/users/fetch-user-auth-details.dal.js'

/**
 * Used by `AuthPlugin` to authenticate and authorise users
 *
 * We take a user id and look it up in the `idm` schema using `FetchUserAuthDetailsDal`.
 *
 * We return an object that indicates whether the user is valid (based on whether the user exists) plus what scope
 * (roles) they have, and what permissions this grants them.
 *
 * @param {object} _request - The {@link https://hapi.dev/api/?v=20.1.2#request|Hapi request} object (unused by this
 * auth service)
 * @param {object} session - The session cookie created by the legacy app holding the user ID and other details
 *
 * @returns {Promise<object>} the permission object
 */
export default async function authService(_request, session) {
  const { userId, company } = session

  const user = await FetchUserAuthDetailsDal(userId)
  const scope = _scope(user, company.id)
  const permission = _permission(scope)

  return { isValid: !!user, credentials: { permission, scope, user } }
}

function _permission(scope) {
  const permission = {
    manageAccess: false,
    manageReturns: false
  }

  if (scope.includes('primary_user')) {
    permission.manageAccess = true
    permission.manageReturns = true
  }

  if (scope.includes('user_returns')) {
    permission.manageReturns = true
  }

  return permission
}

function _scope(user, companyId) {
  const roles = new Set()

  for (const licenceEntityRole of user.licenceEntity.licenceEntityRoles) {
    if (licenceEntityRole.companyEntityId === companyId) {
      roles.add(licenceEntityRole.role)
    }
  }

  return Array.from(roles)
}
