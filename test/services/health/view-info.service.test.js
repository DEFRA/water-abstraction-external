// Test framework
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Test helpers
import { generateUUID } from 'water-abstraction-engine/test/generators.js'

// Things we need to stub
import * as FetchAppInfoService from 'water-abstraction-engine/services/health/fetch-app-info.service.js'
import * as NotifyViewHealthRequest from 'water-abstraction-engine/requests/notify/view-health.request.js'

// Thing under test
import ViewInfoService from '../../../src/services/health/view-info.service.js'

describe('Health - View Info Service', () => {
  let appData
  let notifyData

  beforeEach(() => {
    appData = {
      commit: generateUUID(),
      name: 'External',
      serviceName: 'external',
      version: '1.0.0'
    }

    vi.spyOn(FetchAppInfoService, 'default').mockResolvedValue(appData)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('when the request to Notify is successful', () => {
    beforeEach(() => {
      notifyData = {
        succeeded: true,
        response: {
          statusCode: 200,
          body: {
            message: 'alive'
          }
        }
      }

      vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
    })

    it('returns page data for the view including Notify is "Up and running"', async () => {
      const result = await ViewInfoService()

      expect(result).toEqual({
        pageTitle: 'Info',
        pageTitleCaption: 'Service information',
        appData,
        notifyData: 'Up and running'
      })
    })
  })

  describe('when the request to Notify is unsuccessful', () => {
    describe('though the response contains a status code', () => {
      beforeEach(() => {
        notifyData = {
          succeeded: false,
          response: {
            statusCode: 500,
            body: {
              message: 'Internal Server Error'
            }
          }
        }

        vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
      })

      it('returns page data for the view including the Notify error message', async () => {
        const result = await ViewInfoService()

        expect(result).toEqual({
          pageTitle: 'Info',
          pageTitleCaption: 'Service information',
          appData,
          notifyData: 'ERROR: 500 - Internal Server Error'
        })
      })
    })
  })

  describe('but the response does not contain a status code', () => {
    beforeEach(() => {
      notifyData = {
        succeeded: false,
        response: {
          name: 'NetworkError',
          message: 'Failed to fetch'
        }
      }

      vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
    })

    it('returns page data for the view including the request error message', async () => {
      const result = await ViewInfoService()

      expect(result).toEqual({
        pageTitle: 'Info',
        pageTitleCaption: 'Service information',
        appData,
        notifyData: 'ERROR: NetworkError - Failed to fetch'
      })
    })
  })
})
