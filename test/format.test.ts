import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import * as Notion2content from '../src/notion2content.ts'

describe('normalizeFormatOptions()', () => {
  it('should return normalized options', async () => {
    assert.deepStrictEqual(Notion2content.normalizeFormatOptions(), {
      sanitizeSchema: true
    })
    assert.deepStrictEqual(
      Notion2content.normalizeFormatOptions({ sanitizeSchema: false }),
      {
        sanitizeSchema: false
      }
    )
  })
})

describe('toHtmlString()', () => {
  describe('toFrontmatterString()', () => {
    it('should convert object to frontmatter string', async () => {
      assert.strictEqual(
        await Notion2content.toFrontmatterString({ id: 'test-id' }),
        '---\n---\n'
      )
      assert.strictEqual(
        await Notion2content.toFrontmatterString({
          id: 'test-id',
          props: { 'test-key': 'test-value' }
        }),
        '---\ntest-key: test-value\n---\n'
      )
    })
  })

  it('should convert hast to html string', async () => {
    assert.strictEqual(await Notion2content.toHtmlString({ id: 'test-id' }), '')
    assert.strictEqual(
      await Notion2content.toHtmlString({
        id: 'test-id',
        content: { type: 'text', value: 'test-text' }
      }),
      'test-text'
    )
    assert.strictEqual(
      await Notion2content.toHtmlString({
        id: 'test-id',
        content: { type: 'text', value: 'test-text' }
      }),
      'test-text'
    )
    assert.strictEqual(
      await Notion2content.toHtmlString({
        id: 'test-id',
        content: {
          type: 'element',
          tagName: 'a',
          properties: { href: 'https://example.com' },
          children: []
        }
      }),
      '<a href="https://example.com"></a>'
    )
    assert.strictEqual(
      await Notion2content.toHtmlString(
        {
          id: 'test-id',
          content: {
            type: 'element',
            tagName: 'a',
            properties: { href: 'javascrpt:alert(123)' },
            children: [{ type: 'text', value: 'test-text' }]
          }
        },
        {}
      ),
      '<a>test-text</a>'
    )
    assert.strictEqual(
      await Notion2content.toHtmlString(
        {
          id: 'test-id',
          content: {
            type: 'element',
            tagName: 'a',
            properties: { href: 'javascrpt:alert(123)' },
            children: [{ type: 'text', value: 'test-text' }]
          }
        },
        { sanitizeSchema: false }
      ),
      '<a href="javascrpt:alert(123)">test-text</a>'
    )
  })

  describe('toMarkdownString()', () => {
    it('should convert hast to markdown string', async () => {
      assert.strictEqual(
        await Notion2content.toMarkdownString({ id: 'test-id' }),
        ''
      )
      assert.strictEqual(
        await Notion2content.toMarkdownString({
          id: 'test-id',
          content: { type: 'text', value: 'test-text' }
        }),
        'test-text\n'
      )
      assert.strictEqual(
        await Notion2content.toMarkdownString(
          {
            id: 'test-id',
            content: {
              type: 'element',
              tagName: 'a',
              properties: { href: 'javascrpt:alert(123)' },
              children: [{ type: 'text', value: 'test-text' }]
            }
          },
          {}
        ),
        '[test-text]()\n'
      )
      assert.strictEqual(
        await Notion2content.toMarkdownString(
          {
            id: 'test-id',
            content: {
              type: 'element',
              tagName: 'a',
              properties: { href: 'javascrpt:alert(123)' },
              children: [{ type: 'text', value: 'test-text' }]
            }
          },
          { sanitizeSchema: false }
        ),
        '[test-text](javascrpt:alert\\(123\\))\n'
      )
    })
  })
})
