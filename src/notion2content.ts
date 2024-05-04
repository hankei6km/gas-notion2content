import { ToContentOpts, toContent as _toContent } from 'notion2content'
import { ClientOpts, Client } from './client.js'

export namespace Notion2content {
  export function toContent(
    clientOpts: ClientOpts,
    toContentOpts: ToContentOpts
  ) {
    const c = new Client(clientOpts)
    return _toContent(c, toContentOpts)
  }
}
