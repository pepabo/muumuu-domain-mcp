# ムームードメイン MCP サーバー

[English README](./README.md)

[ムームードメイン](https://muumuu-domain.com/)（[GMO ペパボ株式会社](https://pepabo.com/)が運営するドメイン取得サービス）の公式リモート [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) サーバーです。

AI アシスタントとの自然な会話を通じて、ドメインの検索・取得、保有ドメインや契約の管理、DNS レコードの設定などを行えます。

> **国内ドメインサービス初のリモート MCP サーバー**

## エンドポイント

```
https://mcp.muumuu-domain.com/mcp
```

トランスポート: Streamable HTTP / 認証: OAuth 2.1（対応クライアントが自動処理）

## 機能

- **ドメイン検索・取得** — 空き検索、価格確認、ドメイン取得
- **ドメイン管理** — 保有ドメインの一覧表示・詳細確認
- **DNS 管理** — レコードの一覧表示・作成・更新・削除
- **契約管理** — 契約一覧（更新日・自動更新状態等）の表示・詳細確認

料金: **MCP サーバーの利用は無料です。** ドメイン取得時にはムームードメインの通常料金がかかります。

## クイックスタート

利用するクライアントを選んでください。

### Claude Code

```bash
claude mcp add --transport http muumuu https://mcp.muumuu-domain.com/mcp
```

その後、Claude Code 内で `/mcp` を実行し **Authenticate** を選んで OAuth フローを完了します。

[Claude Code MCP ドキュメント](https://docs.anthropic.com/en/docs/claude-code/mcp)

### Claude Desktop / claude.ai

設定 → コネクタ → **カスタムコネクタを追加** で以下の URL を入力:

```
https://mcp.muumuu-domain.com/mcp
```

OAuth は Claude が自動で処理します。

### Cursor

`.cursor/mcp.json` に追加:

```json
{
  "mcpServers": {
    "muumuu": {
      "url": "https://mcp.muumuu-domain.com/mcp"
    }
  }
}
```

### OpenAI Codex CLI

```bash
codex mcp add muumuu --url https://mcp.muumuu-domain.com/mcp
```

### Gemini CLI

リモート MCP サーバー追加方法は [Gemini CLI MCP サーバードキュメント](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md) を参照してください。

### ローカル stdio ブリッジ（上級者向け）

stdio トランスポートのみをサポートするクライアント向けには [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) を利用します:

```json
{
  "mcpServers": {
    "muumuu": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.muumuu-domain.com/mcp"]
    }
  }
}
```

### イントロスペクション専用モード（レジストリ向け）

Glama などの MCP レジストリが、ヘッドレス環境でツール一覧をインデックスする用途（対話的な OAuth 認可を完了できない環境）向けに、stdio 専用のイントロスペクションモードを提供しています:

```bash
node bin/muumuu-mcp.js --introspect-only
```

このモードでは [ツールマニフェスト](./lib/tools.js) を stdio 経由で静的に返します。ネットワーク通信は行わず、`Authorization` ヘッダも読まず、`tools/call` は常に `isError: true` を返します。実運用では使わないでください。

## ツール

提供しているツールは 14 個です。**write** はアカウントの状態を変更するツール、**destructive** は取り消しできないツールを表します。クライアントは呼び出す前にユーザーへ確認してください。

### ドメイン検索・取得

| ツール | 説明 |
| --- | --- |
| `search-domains` | 複数 TLD にまたがってドメイン候補の空き状況と価格を調べる。予約は行わない。 |
| `quote-domain-purchase` | 取得前に見積もりを取得する。確定価格・空き状況・短命な購入トークンを返す。 |
| `purchase-domain` | 見積もりトークンを使って取得を実行する。**write / destructive** — 登録済みクレジットカードに課金される。 |
| `get-domain-purchase-status` | `purchase-domain` で開始した取得処理の進捗を確認する。 |

### ドメイン管理

| ツール | 説明 |
| --- | --- |
| `list-me-domains` | 認証アカウントの保有ドメインを一覧する。状態や FQDN で絞り込み、ページネーション対応。 |
| `get-me-domain` | 保有ドメイン 1 件の詳細（契約期間・自動更新状態・ネームサーバー）を取得する。 |
| `update-me-domain` | 保有ドメインのクレジットカード自動更新を有効／無効にする。**write** |

### DNS 管理

| ツール | 説明 |
| --- | --- |
| `list-me-dns-records` | ドメイン ID を指定して DNS レコードを一覧する。 |
| `list-me-dns-records-by-fqdn` | 同じ一覧を、ドメイン ID がわからない場合に FQDN で指定して取得する。 |
| `create-me-dns-record` | レコードを追加する（A / AAAA / CNAME / MX / TXT / NS / ALIAS / SRV / CAA）。**write** |
| `update-me-dns-record` | 既存レコードの値または優先度を変更する。**write** |
| `delete-me-dns-record` | ゾーンからレコードを削除する。**write / destructive** |

### パーソナルアクセストークン

| ツール | 説明 |
| --- | --- |
| `list-me-personal-access-tokens` | アカウントに発行済みの PAT を一覧する。 |
| `delete-me-personal-access-token` | PAT を失効させる。**write / destructive** |

## ドキュメント

- [ムームードメイン MCP サーバーガイド](https://support.muumuu-domain.com/hc/ja/articles/50278568742803)
- [サービスご案内](https://muumuu-domain.com/muumuu-domain-mcp/)
- [プレスリリース](https://pepabo.com/news/information/202603311100/)

## 必要なもの

- [ムームードメイン](https://muumuu-domain.com/) のアカウント
- MCP 対応クライアント（Claude Desktop、Claude Code、Cursor、OpenAI Codex CLI、Gemini CLI など）

## サポート

- サービスに関するお問い合わせ: [ムームードメイン ヘルプセンター](https://support.muumuu-domain.com/)
- 本リポジトリに関する不具合: [GitHub Issue](https://github.com/pepabo/muumuu-domain-mcp/issues) を作成してください

## ライセンス

[MIT](./LICENSE)
