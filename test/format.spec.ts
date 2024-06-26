import { Notion2content } from '../src/notion2content.js'

describe('normalizeFormatOptions()', () => {
  it('should return normalized options', async () => {
    expect(Notion2content.normalizeFormatOptions()).toEqual({
      sanitizeSchema: true
    })
    expect(
      Notion2content.normalizeFormatOptions({ sanitizeSchema: false })
    ).toEqual({
      sanitizeSchema: false
    })
  })
})

describe('toHtmlString()', () => {
  describe('toFrontmatterString()', () => {
    it('should convert object to frontmatter string', async () => {
      expect(
        await Notion2content.toFrontmatterString({ id: 'test-id' })
      ).toEqual('---\n---\n')
      expect(
        await Notion2content.toFrontmatterString({
          id: 'test-id',
          props: { 'test-key': 'test-value' }
        })
      ).toEqual('---\ntest-key: test-value\n---\n')
    })
  })

  it('should convert hast to html string', async () => {
    expect(await Notion2content.toHtmlString({ id: 'test-id' })).toEqual('')
    expect(
      await Notion2content.toHtmlString({
        id: 'test-id',
        content: { type: 'text', value: 'test-text' }
      })
    ).toEqual('test-text')
    expect(
      await Notion2content.toHtmlString({
        id: 'test-id',
        content: {
          type: 'element',
          tagName: 'a',
          properties: { href: 'https://example.com' },
          children: []
        }
      })
    ).toEqual('<a href="https://example.com"></a>')
    expect(
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
      )
    ).toEqual('<a>test-text</a>')
    expect(
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
      )
    ).toEqual('<a href="javascrpt:alert(123)">test-text</a>')
  })

  describe('toMarkdownString()', () => {
    it('should convert hast to markdown string', async () => {
      expect(await Notion2content.toMarkdownString({ id: 'test-id' })).toEqual(
        ''
      )
      expect(
        await Notion2content.toMarkdownString({
          id: 'test-id',
          content: { type: 'text', value: 'test-text' }
        })
      ).toEqual('test-text\n')
      expect(
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
        )
      ).toEqual('[test-text]()\n')
      expect(
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
        )
      ).toEqual('[test-text](javascrpt:alert\\(123\\))\n')
    })
  })
})
