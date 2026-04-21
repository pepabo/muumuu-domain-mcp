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
