import { describe, it, mock, beforeEach, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'

describe('Notion2content', () => {
  // Notion2content.toContent は Object.defineProperty() で定義されている。
  // _entry_point_ 全体を置き換えることでとりあえず対応。
  let save_entry_point_ = null
  beforeEach(() => {
    save_entry_point_ = _entry_point_
  })
  afterEach(() => {
    _entry_point_ = save_entry_point_
  })

  it('calls Notion2content.toContent via toContent()', (t) => {
    assert.strictEqual(
      typeof _entry_point_.Notion2content.toContent,
      'function'
    )
    _entry_point_ = {
      Notion2content: {
        toContent: mock.fn()
      }
    }
    const auth = randomUUID()
    toContent(
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
    assert.strictEqual(
      _entry_point_.Notion2content.toContent.mock.calls.length,
      1
    )
    assert.deepStrictEqual(
      _entry_point_.Notion2content.toContent.mock.calls[0].arguments,
      [
        { auth },
        {
          target: ['props', 'content'],
          query: {
            database_id: 'dummy'
          },
          toItemsOpts: {},
          toHastOpts: {}
        }
      ]
    )
  })

  describe('toFrontmatterString()', () => {
    it('should convert object to frontmatter string', async () => {
      assert.strictEqual(
        await toFrontmatterString({ id: 'test-id' }),
        '---\n---\n'
      )
      assert.strictEqual(
        await toFrontmatterString({
          id: 'test-id',
          props: { 'test-key': 'test-value' }
        }),
        '---\ntest-key: test-value\n---\n'
      )
    })
  })

  it('should convert hast to html string', async () => {
    assert.strictEqual(await toHtmlString({ id: 'test-id' }), '')
    assert.strictEqual(
      await toHtmlString({
        id: 'test-id',
        content: { type: 'text', value: 'test-text' }
      }),
      'test-text'
    )
  })

  describe('toMarkdownString()', () => {
    it('should convert hast to markdown string', async () => {
      assert.strictEqual(await toMarkdownString({ id: 'test-id' }), '')
      assert.strictEqual(
        await toMarkdownString({
          id: 'test-id',
          content: { type: 'text', value: 'test-text' }
        }),
        'test-text\n'
      )
    })
  })
})
