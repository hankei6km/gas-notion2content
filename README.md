# gas-notion2content

Notion のデータベースを変換しダウンロードする GAS ライブラリー。

実際の処理は [`hankei6km/notion2content`](https://github.com/hankei6km/notion2content) を利用しています。

## Setup

### Apps Script

ライブラリーは App Script で利用できる状態になっています。
Apps Script のコードエディターで以下の手順を実行するとプロジェクトへ追加できます。

1. コードエディターのファイル名一覧が表示される部分の「ライブラリ +」をクリック
1. 「スクリプト ID」フィールドに `1CVcNWUK2y0EqVpABMf_7KIb8MXv8ArTSwaa-9NnSYFdo1kKzw1i0rLv3` を入力し検索をクリック
1. バージョンを選択(通常は最新版)
1. 「ID」を `Notion2content` 等へ変更
1. 「追加」をクリック

上記以外にも Release ページから `gas-notion2content.zip` をダウンロードし、`/dist` ディレクトリーをプロジェクトへコピーできます。

### Notion

Notion 外部からデータベースを参照するためのインテグレーション(API KEY)が必要です。以下を参考に作成してください。機能(権限)は最小で「コンテンツを読み取る」が必要です。

- [Create your integration in Notion](https://developers.notion.com/docs/create-a-notion-integration#create-your-integration-in-notion)

以下を参考に、参照(ダウンロード)予定のデータベースをインテグレーションと共有してください。

- [Give your integration page permissions](https://developers.notion.com/docs/create-a-notion-integration#give-your-integration-page-permissions)

## Usage

### Basic

Notion データベースのページを変換するサンプルです。

```js
async function MyFunc() {
  const props = PropertiesService.getScriptProperties()
  const apiKey = props.getProperty('NOTION2CONTENT_API_KEY')
  const database_id = props.getProperty('NOTION2CONTENT_DATABASE_ID')

  const i = Notion2content.toContent(
    { auth: apiKey },
    {
      target: ['props', 'content'],
      query: {
        database_id: database_id
      },
      toItemsOpts: {},
      toHastOpts: {}
    }
  )

  for await (const c of i) {
    console.log(JSON.stringify(c, null, 2))
  }
}
```

yield:

- `id`: Notion のページのブロックを指す `id` がセットされます
- `props`: Notion のプロパティの値が格納されます
- `content`: Notion のブロックが [hast](https://github.com/syntax-tree/hast) として格納されます

```
{
  "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "props": {
    "ステータス": "Not started",
    "text": "test1",
    // snip...
  },
  "content": {
    "type": "root",
    "children": [
      {
        "type": "element",
        "tagName": "p",
        "properties": {},
        "children": [
          {
            "type": "text",
            "value": "本文的なものを追加。"
          }
        ]
      },
      // snip...
    ]
  }
}
```

### Format

`props` と `content` を変換する簡易的な関数を使えます。

- `toFrontmatterString` - `props` を Frontmatter へ変換
- `toHtmlString` - `content` を HTML へ変換
- `toMarkdownString` - `content` を Markdown へ変換

```js
async function run() {
  for await (const c of i) {
    console.log(await Notion2content.toMarkdownString.(c, { sanitizeSchema: true }))
  }
}
await run()
```

yield:
(以下のサンプルはエディターのフォーマッタで整形されています)

```markdown
## サンプルのページ

- リスト１
- リスト２
- リスト３

| 商品コード | 商品名 |
| ---------- | ------ |
| 201        | りんご |
| 203        | みかん |
| 304        | 食パン |
```

また、NPM パッケージを利用できる状況であれば、[`hast` 用のユーティリティ](https://github.com/syntax-tree/hast?tab=readme-ov-file#list-of-utilities) などでも整形できます。

## TypeScript

TypeScript(clasp) でコードを記述している場合は、以下の方法で型定義を設定できます。

型定義パッケージをインストールします。

```console
$ npm install --save-dev  @hankei6km/gas-notion2content
```

`tsconfig.json` に定義を追加します。

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ES2020",
    "lib": ["ESNext"],
    "types": ["@types/google-apps-script", "@hankei6km/gas-notion2content"]
  }
}
```

## License

MIT License

Copyright (c) 2024 hankei6km
