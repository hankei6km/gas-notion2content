import { toContent as _toContent, Format as _Format } from 'notion2content'
import type { ToContentOpts, Format as _FormatType } from 'notion2content'
import type { ContentRaw } from 'notion2content'
import { Client } from './client.js'
import { sanitize, defaultSchema } from 'hast-util-sanitize'
import type { Schema } from 'hast-util-sanitize'

/**
 * Represents the Notion2content namespace.
 */
export namespace Notion2content {
  /**
   * Represents the options for the client.
   * @typedef {Object} ClientOpts
   * @property {string} auth - The auth token for the Notion API.
   */
  export type ClientOpts = {
    /**
     * The auth token for the Notion API.
     */
    auth: string
  }

  /**
   * Converts Notion content to a custom content format.
   * @param {ClientOpts} clientOpts - The options for the client.
   * @param {ToContentOpts} toContentOpts - The options for converting the content.
   * @returns {AsyncIterator<import('./notion2content').ContentRaw>} The converted content.
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
  export function toContent(
    clientOpts: ClientOpts,
    toContentOpts: ToContentOpts
  ) {
    const c = new Client(clientOpts)
    return _toContent(c, toContentOpts)
  }

  /**
   * Represents the format options for converting content.
   * @typedef {Object} FormatOptions
   * @property {import('hast-util-sanitize').Schema | boolean} [sanitizeSchema] - Whether to sanitize the content schema.
   * @property {import('notion2content').FormatOptions} [_FormatType.FormatOptions] - Additional format options.
   */
  export type FormatOptions = {
    sanitizeSchema?: Schema | boolean
  } & _FormatType.FormatOptions

  /**
   * Returns the default format options.
   * @returns The default format options.
   */
  function defaultFormatOptions(): Required<FormatOptions> {
    return {
      sanitizeSchema: true
    }
  }

  /**
   * Normalizes the format options.
   * @param {.Notion2content.FormatOptions} opts - The format options to normalize.
   * @returns {Notion2content.FormatOptions} The normalized format options.
   */
  export function normalizeFormatOptions(opts?: FormatOptions): FormatOptions {
    if (typeof opts === 'object' && opts !== null) {
      return Object.assign(defaultFormatOptions(), opts)
    }
    return {
      sanitizeSchema: true
    }
  }

  /**
   * Converts Notion content to a frontmatter string.
   * @param {import('./notion2content').ContentRaw} src - The Notion content to convert.
   * @param {FormatOptions} [inOpts?] - The format options for converting the content.
   * @returns {Promise<string>} The converted frontmatter string.
   */
  export async function toFrontmatterString(
    src: ContentRaw,
    inOpts?: FormatOptions
  ) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    return _Format.toFrontmatterString(src, opts)
  }

  /**
   * Converts Notion content to an HTML string.
   * @param {import('./notion2content').ContentRaw} src - The Notion content to convert.
   * @param {FormatOptions} [inOpts?] - The format options for converting the content.
   * @returns The converted HTML string.
   */
  export async function toHtmlString(src: ContentRaw, inOpts?: FormatOptions) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    if (sanitizeSchema) {
      const { id, props, content } = src
      if (typeof sanitizeSchema === 'boolean') {
        return _Format.toHtmlString(
          { id, props, content: content && sanitize(content, defaultSchema) },
          opts
        )
      } else {
        return _Format.toHtmlString(
          {
            id,
            props,
            content: content && sanitize(content, sanitizeSchema)
          },
          opts
        )
      }
    }
    return _Format.toHtmlString(src, opts)
  }

  /**
   * Converts Notion content to a Markdown string.
   * @param {import('./notion2content').ContentRaw} src - The Notion content to convert.
   * @param {FormatOptions} [inOpts?] - The format options for converting the content.
   * @returns The converted Markdown string.
   */
  export async function toMarkdownString(
    src: ContentRaw,
    inOpts?: FormatOptions
  ) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    if (sanitizeSchema) {
      const { id, props, content } = src
      if (typeof sanitizeSchema === 'boolean') {
        return _Format.toMarkdownString(
          { id, props, content: content && sanitize(content, defaultSchema) },
          opts
        )
      } else {
        return _Format.toMarkdownString(
          {
            id,
            props,
            content: content && sanitize(content, sanitizeSchema)
          },
          opts
        )
      }
    }
    return _Format.toMarkdownString(src, opts)
  }
}
