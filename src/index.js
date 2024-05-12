/**
 * gas-notion2content
 * @copyright (c) 2024 hankei6km
 * @license MIT
 * see "LICENSE.txt" "OPEN_SOURCE_LICENSES.txt" of "gas-notion2content.zip" in
 * releases(https://github.com/hankei6km/gas-md2html/releases)
 */

'use strict'

/**
 * Converts Notion content to a generic content format.
 * @param {Object} clientOpts - The client options.
 * @param {Object} toContentOpts - The options for converting to content.
 * @returns {AsyncIterator<Object>} A promise that resolves to the converted content.
 * @example
 * async function MyFunc() {
 *   const props = PropertiesService.getScriptProperties()
 *   const apiKey = props.getProperty('NOTION2CONTENT_API_KEY')
 *   const database_id = props.getProperty('NOTION2CONTENT_DATABASE_ID')
 *
 *   const i = Notion2content.toContent(
 *     { auth: apiKey },
 *     {
 *       target: ['props', 'content'],
 *       query: {
 *         database_id: database_id
 *       },
 *       toItemsOpts: {},
 *       toHastOpts: {}
 *     }
 *   )
 *
 *   for await (const c of i) {
 *     console.log(JSON.stringify(c, null, 2))
 *   }
 * }
 */
function toContent(clientOpts, toContentOpts) {
  return _entry_point_.Notion2content.toContent(clientOpts, toContentOpts)
}

/**
 * Converts Notion content to a frontmatter string.
 * @param {string} src - The source Notion content.
 * @param {Object} inOpts - The input options.
 * @returns {Promise<string>} A promise that resolves to the frontmatter string.
 */
async function toFrontmatterString(src, inOpts) {
  return _entry_point_.Notion2content.toFrontmatterString(src, inOpts)
}

/**
 * Converts Notion content to an HTML string.
 * @param {string} src - The source Notion content.
 * @param {Object} inOpts - The input options.
 * @returns {PromisPromise<string>e} A promise that resolves to the HTML string.
 */
async function toHtmlString(src, inOpts) {
  return _entry_point_.Notion2content.toHtmlString(src, inOpts)
}

/**
 * Converts Notion content to a Markdown string.
 * @param {string} src - The source Notion content.
 * @param {Object} inOpts - The input options.
 * @returns {Promise<string>} A promise that resolves to the Markdown string.
 */
async function toMarkdownString(src, inOpts) {
  return _entry_point_.Notion2content.toMarkdownString(src, inOpts)
}
