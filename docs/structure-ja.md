# 🏗️ プロジェクト構成とアーキテクチャ

このドキュメントでは、プロジェクトのフォルダ構成と設計の考え方を説明します。

ルーティング、サーバー処理、UIの役割をはっきり分けることで、コードが整理され、保守や機能追加がしやすい構成になっています。

## 🗂️ 上位構成

```bash
app/
├── app.css           # グローバルスタイル
├── constants/        # ドメイン定数（パス、ステータスなど）
├── features/         # 機能別のUIロジック（コンポーネント・カスタムフック）
├── root.tsx          # アプリのエントリポイント
├── routes/           # ページルート（loader / action含む）
├── routes.ts         # ナビゲーション用のパス定義
├── schemas/          # バリデーションスキーマ（Zod）
├── server/           # サーバーサイドのロジック（モック）
├── setup-tests.ts    # テスト環境のセットアップ（例：jest-domのimport）
├── types/            # 共通のTypeScript型定義
└── utils/            # 日付整形やルートラベルなどのユーティリティ関数
```

各ディレクトリは単一の責務を持つことで、以下のようなメリットがあります：

- 可読性が高まる
- 機能追加・変更がしやすくなる（＝拡張性が高まる）

## 🧭 ルート定義 (`app/routes`)

```bash
routes/
├── index.tsx
├── todos.tsx              # /todos/* のレイアウト
├── todos._index.tsx       # Todo一覧ページ
├── todos.new.tsx          # Todo作成ページ
├── todos.$id.tsx          # Todo詳細ページ
├── todos.test.tsx
├── todos._index.test.ts
├── todos.new.test.tsx
└── todos.$id.test.tsx
```

### 🧪 ルートのテスト

各主要ルートには対応するテストファイルがあり、loader / action のロジックと UI をまとめて検証しています：

```bash
routes/
├── todos.test.tsx              # TodoLayout の loader / UI をテスト
├── todos._index.test.tsx       # Todo一覧ページの loader / UI をテスト
├── todos.new.test.tsx          # フォーム送信や action / UI をテスト
├── todos.$id.test.tsx          # 詳細ページの loader / 削除・更新 action / UI をテスト
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

```bash
server/
└── todos/
├── create-task.ts          # 新規作成
├── update-task.ts          # 更新
├── delete-task-by-id.ts    # 削除
├── get-task-by-id.ts       # 詳細取得
├── get-task-list.ts        # 一覧取得
├── create-task.test.ts     # 各API処理のテスト
├── update-task.test.ts
├── delete-task-by-id.test.ts
├── get-task-by-id.test.ts
```

- 各ファイルは **API相当の処理を担当するモック関数** を定義
- `routes` 側から `loader` / `action` を通じて呼び出される構成
- 単体テストもそれぞれの関数ごとに実装済み（`.test.ts`）

### ✍️ 設計ポリシー

- ビジネスロジックは**ルートから分離**
- 各関数は：
  - 単一の責務を持ち
  - 単体テストがしやすい構造に

🧪 ルート側からサーバー関数を呼び出すことで、ルートの見通しが良く、テストも簡単になります。

## 🎯 Features (`app/features`)

```bash
features/
└── todos/
    ├── components/
    │   └── error-state.tsx      # エラー状態を表示するための共通UIコンポーネント
    │   └── todo-form.tsx        # タスクの新規作成・編集に対応したフォーム
    └── hooks/
        ├── use-new-todo.ts       # 新規作成ページ用のロジック（フォーム制御・作成処理）
        ├── use-todo-detail.ts    # 詳細ページ用のロジック（フォーム制御・削除・更新処理）
        └── use-todos-index.ts    # 一覧ページ用のロジック（データ表示・並び替えなど）
```

### 🎨 目的

- **機能単位でUIロジックを分離・集約**
- カスタムフックで以下を管理：
  - フォームの状態
  - 送信処理
  - UI状態（ローディング・成功・エラー）

これにより、ルートコンポーネントの肥大化を防ぎ、再利用性が高まります。

## 🧰 ユーティリティ (`app/utils`)

```bash
utils/
├── error.ts               # loaderで発生したエラーをHTTPエラー（404 / 500）として扱うための共通関数
├── format-date.ts         # 日付をフォーマットする関数
├── format-date.test.ts    # ↑の単体テスト
├── task-status.ts         # ステータスの色やラベルを扱うユーティリティ
├── task-status.test.ts    # ↑のテスト
├── route-labels.ts        # パスに応じてヘッダータイトルを返す補助関数
├── route-labels.test.ts   # ↑のテスト
├── test-router-args.ts    # loader/actionのテスト用ヘルパー
```

- UI補助や表示制御のための純粋なユーティリティ関数を管理
- ルーティングパスから画面タイトルを取得する関数もここで定義・テスト

## 🔠 バリデーションと型定義

### スキーマ (`app/schemas`)

```bash
schemas/
└── task.ts
```

- **Zod** を使った型安全なバリデーション定義

### 型定義 (`app/types`)

```bash
types/
└── tasks.ts
```

- `app/types` では、タスクを表す Task 型など、**アプリケーション固有のビジネスロジックに関わる型（ドメイン型）**を定義しています。
  これにより、サーバー側・クライアント側でデータ構造の一貫性を保ち、保守性の高い設計が可能になります。

## 🧱 UIコンポーネント (Storybook)

```bash
stories/
├── button/
│   ├── index.tsx              # メインとなるUIコンポーネント
│   ├── index.stories.tsx      # Storybook 用のストーリー
│   ├── constants.ts           # バリアント・色・サイズなどの定義
│   ├── types.ts               # コンポーネントの Props 型定義
│   └── logics.ts              # 内部のUIロジック（例：クリック時の挙動）
├── modal/
│   ├── index.tsx              # モーダルコンポーネント
│   └── index.stories.tsx      # モーダル用の Storybook ストーリー
├── input/                      # テキスト入力コンポーネント
├── select/                     # セレクトボックス / ドロップダウン
├── textarea/                   # 複数行テキスト入力
├── toast/                      # トースト通知UI
├── loading/                    # ローディング表示（スピナー、スケルトンなど）
├── status-label/               # ステータスやバッジ表示用ラベル
└── suspense/                   # Suspense 境界用のフォールバックUI
```

### 🎨 設計ポリシー

- UI表示専用のコンポーネント群として設計
- ビジネスロジック（データ処理や業務ルール）を含まない
- コンポーネントは Atomic Design を参考に、役割ごとに整理
- Tailwind CSS のみでスタイルを構築し、外部UIライブラリ（Mantine, MUIなど）は不使用
- すべてのコンポーネントは Storybook 上で単体開発・テスト可能

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
