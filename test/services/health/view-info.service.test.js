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
        response: {
          body: {
            message: 'alive'
          },
          statusCode: 200
        },
        succeeded: true
      }

      vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
    })

    it('returns page data for the view including Notify is "Up and running"', async () => {
      const result = await ViewInfoService()

      expect(result).toEqual({
        appData,
        notifyData: 'Up and running',
        pageTitle: 'Info',
        pageTitleCaption: 'Service information'
      })
    })
  })

  describe('when the request to Notify is unsuccessful', () => {
    describe('though the response contains a status code', () => {
      beforeEach(() => {
        notifyData = {
          response: {
            body: {
              message: 'Internal Server Error'
            },
            statusCode: 500
          },
          succeeded: false
        }

        vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
      })

      it('returns page data for the view including the Notify error message', async () => {
        const result = await ViewInfoService()

        expect(result).toEqual({
          appData,
          notifyData: 'ERROR: 500 - Internal Server Error',
          pageTitle: 'Info',
          pageTitleCaption: 'Service information'
        })
      })
    })
  })

  describe('but the response does not contain a status code', () => {
    beforeEach(() => {
      notifyData = {
        response: {
          message: 'Failed to fetch',
          name: 'NetworkError'
        },
        succeeded: false
      }

      vi.spyOn(NotifyViewHealthRequest, 'default').mockResolvedValue(notifyData)
    })

    it('returns page data for the view including the request error message', async () => {
      const result = await ViewInfoService()

      expect(result).toEqual({
        appData,
        notifyData: 'ERROR: NetworkError - Failed to fetch',
        pageTitle: 'Info',
        pageTitleCaption: 'Service information'
      })
    })
  })
})
