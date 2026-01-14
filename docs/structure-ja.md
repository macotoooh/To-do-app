# 🏗️ プロジェクト構成とアーキテクチャ

このドキュメントでは、プロジェクトのフォルダ構成と設計の考え方を説明します。

ルーティング、サーバー処理、UIの役割をはっきり分けることで、コードが整理され、保守や機能追加がしやすい構成になっています。

## 🗂️ 上位構成

```
app/
├── routes/        # ルーティング、loader、action（HTTP層）
├── server/        # サーバーサイドのビジネスロジック
├── features/      # 機能別のUIロジックとhooks
├── utils/         # 共通ユーティリティ
├── schemas/       # バリデーションスキーマ（Zod）
├── types/         # 共有TypeScript型定義
├── constants/     # ドメイン定数
└── root.tsx       # アプリのエントリポイント
```

各ディレクトリは単一の責務を持つことで、以下のようなメリットがあります：

- 可読性が高まる
- 機能追加・変更がしやすくなる（＝拡張性が高まる）

## 🧭 ルート定義 (`app/routes`)

```
routes/
├── index.tsx
├── todos.tsx              # /todos/* のレイアウト
├── todos._index.tsx       # Todo一覧ページ
├── todos.new.tsx          # Todo作成ページ
├── todos.$id.tsx          # Todo詳細ページ
├── todos.test.ts
├── todos._index.test.ts
├── todos.new.test.ts
└── todos.$id.test.ts
```

### 🧪 ルートのテスト

各主要ルートには対応するテストファイルがあり、loader / action のロジックと UI をまとめて検証しています：

```
routes/
├── todos.test.ts              # TodoLayout の loader / UI をテスト
├── todos._index.test.ts       # Todo一覧ページの loader / UI をテスト
├── todos.new.test.ts          # フォーム送信や action / UI をテスト
├── todos.$id.test.ts          # 詳細ページの loader / 削除・更新 action / UI をテスト
```

- テストの対象範囲：
  - `loader` の挙動（成功・失敗パターン）
  - `action` のレスポンス（リダイレクトやエラー処理）
  - データ取得後の UI描画の確認（結合テスト）

- **Vitest** + **React Testing Library** を使用

💡 ルートごとに処理を分けてテストしているので、他の画面や機能に関係なく、単独で動作を確認できます。

#### 🧪 なぜルートをテストするのか？

`loader` や `action` をテストすることで以下が保証されます：

- SSR時のハイドレーションが正常に行われる
- フォーム送信が期待通りに動作する
- データの状態に応じたUIが正しく描画される

### ✍️ 設計ポリシー

- 各ルートは **HTTPハンドラー** として機能します

- `loader` / `action` で以下を担います：
  - データ取得
  - ミューテーション処理
  - リダイレクト
  - エラーハンドリング

- UIロジックは最小限に留め、見通しの良いコードを実現

💡 **Remixライクな「サーバーファースト」なルーティングモデル** を採用しています。

## 🧠 サーバーロジック (`app/server`)

```
server/
└── todos/
    ├── create-task.ts
    ├── update-task.ts
    ├── delete-task-by-id.ts
    ├── get-task-by-id.ts
    ├── get-task-list.ts
    └── *.test.ts
```

### ✍️ 設計ポリシー

- ビジネスロジックは**ルートから分離**
- 各関数は：
  - 単一の責務を持ち
  - 単体テストがしやすい構造に

🧪 ルート側からサーバー関数を呼び出すことで、ルートの見通しが良く、テストも簡単になります。

## 🎯 Features (`app/features`)

```

features/
└── todos/
├── components/
│   └── todo-form.tsx         # 入力フォーム（新規・編集両対応）
└── hooks/
├── use-new-todo.ts       # 新規作成ページのロジック（form制御、submit処理）
├── use-todo-detail.ts    # 詳細ページのロジック（削除・更新処理など）
└── use-todos-index.ts    # 一覧ページのロジック（データ表示・並び替えなど）

```

### 🎨 目的

- **機能単位でUIロジックを分離・集約**
- カスタムフックで以下を管理：
  - フォームの状態
  - 送信処理
  - UI状態（ローディング・成功・エラー）

これにより、ルートコンポーネントの肥大化を防ぎ、再利用性が高まります。

## 🧰 ユーティリティ (`app/utils`)

```
utils/
├── format-date.ts // 日付をフォーマットする関数
├── format-date.test.ts // ↑の単体テスト
├── task-status.ts // ステータスの色やラベルを扱うユーティリティ
├── task-status.test.ts
├── route-labels.ts // パスに応じてヘッダータイトルを返す補助関数
├── route-labels.test.ts // ↑のテスト
├── test-router-args.ts // loader/actionのテスト用ヘルパー
```

- UI補助や表示制御のための純粋なユーティリティ関数を管理
- ルーティングパスから画面タイトルを取得する関数もここで定義・テスト

## 🔠 バリデーションと型定義

### スキーマ (`app/schemas`)

```
schemas/
└── task.ts
```

- **Zod** を使った型安全なバリデーション定義

### 型定義 (`app/types`)

```
types/
└── tasks.ts
```

- サーバーとUIで共有されるドメイン型を定義

## 🧱 UIコンポーネント (Storybook)

```
stories/
├── button
├── input
├── select
├── textarea
├── modal
├── toast
├── loading
├── status-label
└── suspense
```

### 🎨 設計ポリシー

- UI表示専用のコンポーネント群
- ビジネスロジック（データ処理や業務ルール）を含まない
- Storybook 上で個別に開発・テスト可能

## ✅ 設計方針まとめ

- **サーバーロジック中心**
  UIではなくサーバー層にビジネスロジックを集約

- **スリムなルート**
  ルートは HTTP まわりだけに集中

- **機能別UI構成**
  技術ごとではなくドメイン単位で構造を整理

- **型安全とテスト重視**
  TypeScript + 単体テストでメンテ性を確保

## 🤔 なぜこの構成にしたのか？

アプリが大きくなってもコードが複雑になりすぎないように、責務の分離と拡張しやすさを意識した構成にしました。
小規模なアプリでも、実務に近い設計や開発の流れを意識して構築しています。
