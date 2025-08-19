import { jest } from '@jest/globals'
import { Client } from '../src/client.js'
import { randomUUID } from 'node:crypto'

const saveUrlFetchApp = globalThis.UrlFetchApp
afterEach(() => {
  globalThis.UrlFetchApp = saveUrlFetchApp
})

describe('Client', () => {
  it('should queryDatabases is successful', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(200),
      getContentText: jest
        .fn()
        .mockReturnValue(JSON.stringify(exampleQueryDatabasesResult))
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })

    await expect(c.queryDatabases({ database_id: 'dummy' })).resolves.toEqual(
      exampleQueryDatabasesResult
    )
    expect(mockfetch).toHaveBeenCalledWith(
      'https://api.notion.com/v1/databases/dummy/query',
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-02-22'
        },
        method: 'post',
        muteHttpExceptions: true,
        payload: '{}'
      }
    )
  })

  it('should reject in queryDatabases by internal server error', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(500),
      getContentText: jest.fn().mockReturnValue('Internal Server Error')
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })
    await expect(c.queryDatabases({ database_id: 'dummy' })).rejects.toThrow(
      /^queryDatabases 500, text: Internal Server Error$/
    )
  })

  it('should listBlockChildren is successful', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(200),
      getContentText: jest
        .fn()
        .mockReturnValue(JSON.stringify(exampleListBlockChildrenResult))
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })
    await expect(c.listBlockChildren({ block_id: 'dummy' })).resolves.toEqual(
      exampleListBlockChildrenResult
    )
    expect(mockfetch).toHaveBeenCalledWith(
      'https://api.notion.com/v1/blocks/dummy/children',
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-02-22'
        },
        method: 'get',
        muteHttpExceptions: true
      }
    )
  })

  it('should throw error from listBlockChildren', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(500),
      getContentText: jest.fn().mockReturnValue('Internal Server Error')
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })
    await expect(c.listBlockChildren({ block_id: 'dummy' })).rejects.toThrow(
      /^listBlockChildren 500, text: Internal Server Error$/
    )
  })

  it('should call listBlockChildren with start_cursor', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(200),
      getContentText: jest
        .fn()
        .mockReturnValue(JSON.stringify(exampleListBlockChildrenResult))
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })
    await expect(
      c.listBlockChildren({ block_id: 'dummy', start_cursor: 'abc-123' })
    ).resolves.toEqual(exampleListBlockChildrenResult)
    expect(mockfetch).toHaveBeenCalledWith(
      'https://api.notion.com/v1/blocks/dummy/children?start_cursor=abc-123',
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-02-22'
        },
        method: 'get',
        muteHttpExceptions: true
      }
    )
  })

  it('should call listBlockChildren with page_size', async () => {
    const mockfetch = jest.fn().mockReturnValue({
      getResponseCode: jest.fn().mockReturnValue(200),
      getContentText: jest
        .fn()
        .mockReturnValue(JSON.stringify(exampleListBlockChildrenResult))
    })
    globalThis.UrlFetchApp = {
      fetch: mockfetch
    } as any

    const auth = randomUUID()
    const c = new Client({ auth })
    await expect(
      c.listBlockChildren({ block_id: 'dummy', page_size: 123 })
    ).resolves.toEqual(exampleListBlockChildrenResult)
    expect(mockfetch).toHaveBeenCalledWith(
      'https://api.notion.com/v1/blocks/dummy/children?page_size=123',
      {
        headers: {
          Authorization: `Bearer ${auth}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-02-22'
        },
        method: 'get',
        muteHttpExceptions: true
      }
    )
  })
})

// https://developers.notion.com/reference/post-database-query
const exampleQueryDatabasesResult = {
  object: 'list',
  results: [
    {
      object: 'page',
      id: '59833787-2cf9-4fdf-8782-e53db20768a5',
      created_time: '2022-03-01T19:05:00.000Z',
      last_edited_time: '2022-07-06T20:25:00.000Z',
      created_by: {
        object: 'user',
        id: 'ee5f0f84-409a-440f-983a-a5315961c6e4'
      },
      last_edited_by: {
        object: 'user',
        id: '0c3e9826-b8f7-4f73-927d-2caaf86f1103'
      },
      cover: {
        type: 'external',
        external: {
          url: 'https://upload.wikimedia.org/wikipedia/commons/6/62/Tuscankale.jpg'
        }
      },
      icon: {
        type: 'emoji',
        emoji: '🥬'
      },
      parent: {
        type: 'database_id',
        database_id: 'd9824bdc-8445-4327-be8b-5b47500af6ce'
      },
      archived: false,
      properties: {
        'Store availability': {
          id: '%3AUPp',
          type: 'multi_select',
          multi_select: [
            {
              id: 't|O@',
              name: "Gus's Community Market",
              color: 'yellow'
            },
            {
              id: '{Ml\\',
              name: 'Rainbow Grocery',
              color: 'gray'
            }
          ]
        },
        'Food group': {
          id: 'A%40Hk',
          type: 'select',
          select: {
            id: '5e8e7e8f-432e-4d8a-8166-1821e10225fc',
            name: '🥬 Vegetable',
            color: 'pink'
          }
        },
        Price: {
          id: 'BJXS',
          type: 'number',
          number: 2.5
        },
        'Responsible Person': {
          id: 'Iowm',
          type: 'people',
          people: [
            {
              object: 'user',
              id: 'cbfe3c6e-71cf-4cd3-b6e7-02f38f371bcc',
              name: 'Cristina Cordova',
              avatar_url:
                'https://lh6.googleusercontent.com/-rapvfCoTq5A/AAAAAAAAAAI/AAAAAAAAAAA/AKF05nDKmmUpkpFvWNBzvu9rnZEy7cbl8Q/photo.jpg',
              type: 'person',
              person: {
                email: 'cristina@makenotion.com'
              }
            }
          ]
        },
        'Last ordered': {
          id: 'Jsfb',
          type: 'date',
          date: {
            start: '2022-02-22',
            end: null,
            time_zone: null
          }
        },
        'Cost of next trip': {
          id: 'WOd%3B',
          type: 'formula',
          formula: {
            type: 'number',
            number: 0
          }
        },
        Recipes: {
          id: 'YfIu',
          type: 'relation',
          relation: [
            {
              id: '90eeeed8-2cdd-4af4-9cc1-3d24aff5f63c'
            },
            {
              id: 'a2da43ee-d43c-4285-8ae2-6d811f12629a'
            }
          ],
          has_more: false
        },
        Description: {
          id: '_Tc_',
          type: 'rich_text',
          rich_text: [
            {
              type: 'text',
              text: {
                content: 'A dark ',
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
              plain_text: 'A dark ',
              href: null
            },
            {
              type: 'text',
              text: {
                content: 'green',
                link: null
              },
              annotations: {
                bold: false,
                italic: false,
                strikethrough: false,
                underline: false,
                code: false,
                color: 'green'
              },
              plain_text: 'green',
              href: null
            },
            {
              type: 'text',
              text: {
                content: ' leafy vegetable',
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
              plain_text: ' leafy vegetable',
              href: null
            }
          ]
        },
        'In stock': {
          id: '%60%5Bq%3F',
          type: 'checkbox',
          checkbox: true
        },
        'Number of meals': {
          id: 'zag~',
          type: 'rollup',
          rollup: {
            type: 'number',
            number: 2,
            function: 'count'
          }
        },
        Photo: {
          id: '%7DF_L',
          type: 'url',
          url: 'https://i.insider.com/612fb23c9ef1e50018f93198?width=1136&format=jpeg'
        },
        Name: {
          id: 'title',
          type: 'title',
          title: [
            {
              type: 'text',
              text: {
                content: 'Tuscan kale',
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
              plain_text: 'Tuscan kale',
              href: null
            }
          ]
        }
      },
      url: 'https://www.notion.so/Tuscan-kale-598337872cf94fdf8782e53db20768a5'
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
    },
    {
      object: 'block',
      id: 'acc7eb06-05cd-4603-a384-5e1e4f1f4e72',
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
      type: 'paragraph',
      paragraph: {
        rich_text: [
          {
            type: 'text',
            text: {
              content:
                'Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.',
              link: {
                url: 'https://en.wikipedia.org/wiki/Lacinato_kale'
              }
            },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text:
              'Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.',
            href: 'https://en.wikipedia.org/wiki/Lacinato_kale'
          }
        ],
        color: 'default'
      }
    }
  ],
  next_cursor: null,
  has_more: false,
  type: 'block',
  block: {}
}
