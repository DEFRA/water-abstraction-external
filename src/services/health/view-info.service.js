/**
 * Orchestrates fetching and presenting the data needed for the view info page
 * @module ViewInfoService
 */

import FetchAppInfoService from 'water-abstraction-engine/services/health/fetch-app-info.service.js'
import NotifyViewHealthRequest from 'water-abstraction-engine/requests/notify/view-health.request.js'

const SERVICE_RUNNING_MESSAGE = 'Up and running'

/**
 * Orchestrates fetching and presenting the data needed for the view info page
 *
 * Returns data required to populate our `/health/info` page.
 *
 * Each data set is returned in the format needed to populate the gov.uk table elements ie. an array containing one
 * array per row, where each row array contains multiple `{ text: '...' }` elements, one for each cell in the row.
 *
 * @returns {Promise<object>} data about the service formatted for the view
 */
export default async function viewInfoService() {
  const appData = await FetchAppInfoService('external')

  const notifyData = await _notifyData()

  return {
    pageTitle: 'Info',
    pageTitleCaption: 'Service information',
    appData,
    notifyData
  }
}

async function _notifyData() {
  const result = await NotifyViewHealthRequest()

  if (result.succeeded) {
    return SERVICE_RUNNING_MESSAGE
  }

  return _parseFailedRequestResult(result)
}

function _parseFailedRequestResult(result) {
  if (result.response.statusCode) {
    return `ERROR: ${result.response.statusCode} - ${result.response.body.message}`
  }

  return `ERROR: ${result.response.name} - ${result.response.message}`
}
