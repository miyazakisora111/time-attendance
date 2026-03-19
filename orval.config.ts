import { defineConfig } from 'orval'

export default defineConfig({
    api: {
        input: './openapi/build/bundle.yaml',
        output: {
            mode: 'tags-split', // タグごとにファイル分割
            target: './front/src/__generated__/index.ts', // 生成先
            schemas: './front/src/__generated__/model', // Zod 型出力先
            client: 'axios', // API 作成
            tsconfig: './front/tsconfig.json',
            override: {
                mutator: {
                    path: './front/src/lib/http/client.ts', // Axios instance などを定義したファイル
                    name: 'customInstance', // mutator で使う関数名
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                },
            },
        },
        hooks: {
            afterAllFilesWrite: [
                'npm run openapi:validators',
                'prettier --write',
            ], // prettier 自動整形 + 追加バリデーション生成
        }
    },
})
