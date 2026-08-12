import type { Client as NotionClient } from '@notionhq/client'
import { Client as N2CClient } from 'notion2content'
import type * as Notion2content from './notion2content.js'

const apiVersion = '2026-03-11'
const apiUrlDataSourcesQuery = (data_source_id: string) =>
  `https://api.notion.com/v1/data_sources/${data_source_id}/query`
const startCursorRegExp = new RegExp(/^[\da-f\-]+$/)
const apiUrlBlockChildren = (
  database_id: string,
  start_cursor?: string | null,
  page_size?: number
) => {
  const params: string[] = []
  // ドキュメントだとUUIDv4だがハイフンなしも許容されるようなので厳密な判定ではない
  // 型的には null も含まれるがドキュメントでは string<uuid> と表現されている。
  // null のときの扱いが不明(以下の処理では query パラメーターに含めない対応としている)
  if (start_cursor && startCursorRegExp.test(start_cursor)) {
    params.push(`start_cursor=${start_cursor}`)
  }
  if (typeof page_size === 'number' && page_size > 0) {
    params.push(`page_size=${page_size}`)
  }
  if (params.length > 0) {
    return `https://api.notion.com/v1/blocks/${database_id}/children?${params.join(
      '&'
    )}`
  }
  return `https://api.notion.com/v1/blocks/${database_id}/children`
}

export function isErrRes(
  res: GoogleAppsScript.URL_Fetch.HTTPResponse
): boolean {
  const code = Math.trunc(res.getResponseCode() / 100)
  if (code === 4 || code === 5) {
    return true
  }
  return false
}

export class Client extends N2CClient {
  private auth: string = ''
  constructor(options: Notion2content.ClientOpts) {
    super()
    this.auth = options.auth
  }

  queryDataSources(
    ...args: Parameters<NotionClient['dataSources']['query']>
  ): ReturnType<NotionClient['dataSources']['query']> {
    const url = apiUrlDataSourcesQuery(args[0].data_source_id)
    const { data_source_id, ...payload } = args[0]
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
      return Promise.reject(
        new Error(
          `queryDataSources ${res.getResponseCode()}, text: ${res.getContentText()}`
        )
      )
    }
    const resQuery = JSON.parse(res.getContentText()) as Awaited<
      ReturnType<NotionClient['dataSources']['query']>
    >
    return Promise.resolve(resQuery)
  }
  listBlockChildren(
    ...args: Parameters<NotionClient['blocks']['children']['list']>
  ): ReturnType<NotionClient['blocks']['children']['list']> {
    const url = apiUrlBlockChildren(
      args[0].block_id,
      args[0].start_cursor,
      args[0].page_size
    )
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
      return Promise.reject(
        new Error(
          `listBlockChildren ${res.getResponseCode()}, text: ${res.getContentText()}`
        )
      )
    }
    const resQuery = JSON.parse(res.getContentText()) as Awaited<
      ReturnType<NotionClient['blocks']['children']['list']>
    >
    return Promise.resolve(resQuery)
  }
}
