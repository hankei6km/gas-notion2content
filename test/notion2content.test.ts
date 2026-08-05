import { describe, it, mock, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import * as Notion2content from '../src/notion2content.ts'

const saveUrlFetchApp = globalThis.UrlFetchApp
afterEach(() => {
  globalThis.UrlFetchApp = saveUrlFetchApp
})

describe('Notion2content.toContent', () => {
  it('should return async iterator from toContent()', async () => {
    const mockfetch = mock.fn(() => ({
      getResponseCode: mock.fn(() => 200),
      getContentText: mock.fn(() => JSON.stringify('{"results": []}'))
    }))
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const i = Notion2content.toContent(
      { auth },
      {
        target: ['props', 'content'],
        query: {
          database_id: 'dummy'
        },
        toItemsOpts: {},
        toHastOpts: {}
      }
    )
    assert.deepStrictEqual(await i.next(), { done: true, value: undefined })
  })

  it('should retrive pages by async iterator', async () => {
    const mockfetch = mock.fn(() => ({
      getResponseCode: mock.fn(() => 200),
      getContentText: mock.fn(() =>
        JSON.stringify(exampleListBlockChildrenResult)
      )
    }))
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const i = Notion2content.toContent(
      { auth },
      {
        target: ['props', 'content'],
        query: {
          database_id: 'dummy'
        },
        toItemsOpts: {},
        toHastOpts: {}
      }
    )
    assert.deepStrictEqual(await i.next(), {
      done: false,
      value: {
        content: {
          children: [
            {
              children: [
                {
                  type: 'text',
                  value: 'Lacinato kale'
                }
              ],
              properties: {},
              tagName: 'h2',
              type: 'element'
            }
          ],
          type: 'root'
        },
        id: 'c02fc1d3-db8b-45c5-a222-27595b15aea7',
        props: {}
      }
    })
    assert.deepStrictEqual(await i.next(), { done: true, value: undefined })
  })

  it('should reject in async iterator', async (t) => {
    const mockfetch = t.mock.fn(() => ({
      getResponseCode: t.mock.fn(() => 500),
      getContentText: t.mock.fn(() => 'Internal Server Error')
    }))
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const i = Notion2content.toContent(
      { auth },
      {
        target: ['props', 'content'],
        query: {
          database_id: 'dummy'
        },
        toItemsOpts: {},
        toHastOpts: {}
      }
    )
    await assert.rejects(i.next(), (err: Error) => {
      assert.match(
        err.message,
        /^toContent: error from fetchPages: Error: queryDatabases 500, text: Internal Server Error, database_id:dummy$/
      )
      return true
    })
    assert.deepStrictEqual(await i.next(), { done: true, value: undefined })
  })
})

// https://developers.notion.com/reference/post-database-query
const exampleQueryDatabasesResult = {
  object: 'list',
  results: [
    {
      object: 'page',
      id: '59833787-2cf9-4fdf-8782-e53db20768a5',
      archived: false,
      properties: {}
    }
  ],
  next_cursor: null,
  has_more: false,
  type: 'page_or_database',
  page_or_database: {}
}

// https://developers.notion.com/reference/get-block-children
const exampleListBlockChildrenResult = {
  object: 'list',
  results: [
    {
      object: 'block',
      id: 'c02fc1d3-db8b-45c5-a222-27595b15aea7',
      parent: {
        type: 'page_id',
        page_id: '59833787-2cf9-4fdf-8782-e53db20768a5'
      },
      created_time: '2022-03-01T19:05:00.000Z',
      last_edited_time: '2022-03-01T19:05:00.000Z',
      created_by: {
        object: 'user',
        id: 'ee5f0f84-409a-440f-983a-a5315961c6e4'
      },
      last_edited_by: {
        object: 'user',
        id: 'ee5f0f84-409a-440f-983a-a5315961c6e4'
      },
      has_children: false,
      archived: false,
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: 'Lacinato kale',
              link: null
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: 'Lacinato kale',
            href: null
          }
        ],
        color: 'default',
        is_toggleable: false
      }
    }
  ],
  next_cursor: null,
  has_more: false,
  type: 'block',
  block: {}
}
