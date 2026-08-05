import { jest } from '@jest/globals'
import { randomUUID } from 'node:crypto'

describe('Notion2content', () => {
  // dummy テストは一旦保留。
  // Namepace の代わりに import を利用したのでメソッドの直接書き換えができない。
  // note test へ移行のときに考える。
  // let saveTtoContent = null
  // beforeEach(() => {
  //   // beforeEach の外だと `_entry_point_` が `undefined` になる。
  //   saveTtoContent = _entry_point_.Notion2content.toContent
  // })
  // afterEach(() => {
  //   _entry_point_.Notion2content.toContent = saveTtoContent
  // })

  // it('dummy', () => {
  //   expect(toContent).toBeInstanceOf(Function)
  //   expect(_entry_point_.Notion2content.toContent).toBeInstanceOf(Function) // 存在の確認のみ
  //   _entry_point_.Notion2content.toContent = jest.fn()
  //   const auth = randomUUID()
  //   toContent(
  //     { auth },
  //     {
  //       target: ['props', 'content'],
  //       query: {
  //         database_id: 'dummy'
  //       },
  //       toItemsOpts: {},
  //       toHastOpts: {}
  //     }
  //   )
  //   expect(_entry_point_.Notion2content.toContent).toHaveBeenCalledWith(
  //     { auth },
  //     {
  //       target: ['props', 'content'],
  //       query: {
  //         database_id: 'dummy'
  //       },
  //       toItemsOpts: {},
  //       toHastOpts: {}
  //     }
  //   )
  // })

  describe('toFrontmatterString()', () => {
    it('should convert object to frontmatter string', async () => {
      expect(await toFrontmatterString({ id: 'test-id' })).toEqual('---\n---\n')
      expect(
        await toFrontmatterString({
          id: 'test-id',
          props: { 'test-key': 'test-value' }
        })
      ).toEqual('---\ntest-key: test-value\n---\n')
    })
  })

  it('should convert hast to html string', async () => {
    expect(await toHtmlString({ id: 'test-id' })).toEqual('')
    expect(
      await toHtmlString({
        id: 'test-id',
        content: { type: 'text', value: 'test-text' }
      })
    ).toEqual('test-text')
  })

  describe('toMarkdownString()', () => {
    it('should convert hast to markdown string', async () => {
      expect(await toMarkdownString({ id: 'test-id' })).toEqual('')
      expect(
        await toMarkdownString({
          id: 'test-id',
          content: { type: 'text', value: 'test-text' }
        })
      ).toEqual('test-text\n')
    })
  })
})
