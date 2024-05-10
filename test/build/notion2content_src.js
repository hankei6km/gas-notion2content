describe('Notion2content', () => {
  it('dummy', () => {})

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

  describe('toHMarkdownString()', () => {
    it('should convert hast to markdown string', async () => {
      expect(await toHMarkdownString({ id: 'test-id' })).toEqual('')
      expect(
        await toHMarkdownString({
          id: 'test-id',
          content: { type: 'text', value: 'test-text' }
        })
      ).toEqual('test-text\n')
    })
  })
})
