import type { Client as NotionClient } from '@notionhq/client'
import { QueryDatabaseResponse } from '@notionhq/client/build/src/api-endpoints'
import { Client as N2CClient } from 'notion2content'

const apiVersion = '2022-02-22'
const apiUrlDabtabaseQuery = (database_id: string) =>
  `https://api.notion.com/v1/databases/${database_id}/query`
const apiUrlBlockChildren = (database_id: string) =>
  `https://api.notion.com/v1/blocks/${database_id}/children`

export function isErrRes(
  res: GoogleAppsScript.URL_Fetch.HTTPResponse
): boolean {
  const code = Math.trunc(res.getResponseCode() / 100)
  if (code === 4 || code === 5) {
    return true
  }
  return false
}

/**
 * Represents the options for the client.
 * @typedef {Object} ClientOpts
 * @property {string} auth - The auth token for the Notion API.
 */
export type ClientOpts = {
  /**
   * The auth token for the Notion API.
   */
  auth: string
}

export class Client extends N2CClient {
  private auth: string = ''
  constructor(options: ClientOpts) {
    super()
    this.auth = options.auth
  }

  queryDatabases(
    ...args: Parameters<NotionClient['databases']['query']>
  ): ReturnType<NotionClient['databases']['query']> {
    const url = apiUrlDabtabaseQuery(args[0].database_id)
    const { database_id, ...payload } = args[0]
    console.log('queryDatabases payload:')
    console.log(JSON.stringify(payload, null, 2))
    const res = UrlFetchApp.fetch(url, {
      method: 'post',
      headers: {
        Authorization: `Bearer ${this.auth}`,
        'Content-Type': 'application/json',
        'Notion-Version': apiVersion
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    })
    if (isErrRes(res)) {
      throw new Error(
        `queryDatabases ${res.getResponseCode()}, text: ${res.getContentText()}`
      )
    }
    const resQuery = JSON.parse(res.getContentText()) as ReturnType<
      NotionClient['databases']['query']
    >
    return Promise.resolve(resQuery)
  }
  listBlockChildren(
    ...args: Parameters<NotionClient['blocks']['children']['list']>
  ): ReturnType<NotionClient['blocks']['children']['list']> {
    const url = apiUrlBlockChildren(args[0].block_id)
    console.log('listBlockChildren args:')
    console.log(JSON.stringify(args[0], null, 2))
    const res = UrlFetchApp.fetch(url, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${this.auth}`,
        'Content-Type': 'application/json',
        'Notion-Version': apiVersion
      },
      muteHttpExceptions: true
    })
    if (isErrRes(res)) {
      throw new Error(
        `listBlockChildren ${res.getResponseCode()}, text: ${res.getContentText()}`
      )
    }
    const resQuery = JSON.parse(res.getContentText()) as ReturnType<
      NotionClient['blocks']['children']['list']
    >
    return Promise.resolve(resQuery)
  }
}
