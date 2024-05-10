/**
 * gas-notion2content
 * @copyright (c) 2024 hankei6km
 * @license MIT
 * see "LICENSE.txt" "OPEN_SOURCE_LICENSES.txt" of "gas-notion2content.zip" in
 * releases(https://github.com/hankei6km/gas-md2html/releases)
 */

'use strict'

function toContent(clientOpts, toContentOpts) {
  return _entry_point_.Notion2content.toContent(clientOpts, toContentOpts)
}

async function toFrontmatterString(src, inOpts) {
  return _entry_point_.Notion2content.Format.toFrontmatterString(src, inOpts)
}

async function toHtmlString(src, inOpts) {
  return _entry_point_.Notion2content.Format.toHtmlString(src, inOpts)
}

async function toMarkdownString(src, inOpts) {
  return _entry_point_.Notion2content.Format.toMarkdownString(src, inOpts)
}
