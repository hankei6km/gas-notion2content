import {
  ToContentOpts,
  toContent as _toContent,
  Format as _Format
} from 'notion2content'
import type { ContentRaw } from 'notion2content'
import { Client } from './client.js'
import { sanitize, defaultSchema } from 'hast-util-sanitize'
import type { Schema } from 'hast-util-sanitize'

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

  export function toContent(
    clientOpts: ClientOpts,
    toContentOpts: ToContentOpts
  ) {
    const c = new Client(clientOpts)
    return _toContent(c, toContentOpts)
  }

  export type FormatOptions = {
    sanitizeSchema?: Schema | boolean
  } & _Format.FormatOptions

  function defaultFormatOptions(): Required<FormatOptions> {
    return {
      sanitizeSchema: true
    }
  }

  export function normalizeFormatOptions(opts?: FormatOptions): FormatOptions {
    if (typeof opts === 'object' && opts !== null) {
      return Object.assign(defaultFormatOptions(), opts)
    }
    return {
      sanitizeSchema: true
    }
  }

  export async function toFrontmatterString(
    src: ContentRaw,
    inOpts?: FormatOptions
  ) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    return _Format.toFrontmatterString(src, opts)
  }

  export async function toHtmlString(src: ContentRaw, inOpts?: FormatOptions) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    if (sanitizeSchema) {
      const { id, props, content } = src
      if (typeof sanitizeSchema === 'boolean') {
        return _Format.toHtmlString(
          { id, props, content: content && sanitize(content) },
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

  export async function toMarkdownString(
    src: ContentRaw,
    inOpts?: FormatOptions
  ) {
    const { sanitizeSchema, ...opts } = normalizeFormatOptions(inOpts)
    if (sanitizeSchema) {
      const { id, props, content } = src
      if (typeof sanitizeSchema === 'boolean') {
        return _Format.toMarkdownString(
          { id, props, content: content && sanitize(content) },
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
