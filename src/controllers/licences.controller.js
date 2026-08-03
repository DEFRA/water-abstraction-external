import ViewLicenceService from '../services/licences/view-licence.service.js'

export async function viewLicence(request, h) {
  const { id: licenceId } = request.params

  const pageData = await ViewLicenceService(licenceId, request.auth)

  return h.view('licences/view.njk', pageData)
}
