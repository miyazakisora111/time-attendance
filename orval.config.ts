import { defineConfig } from 'orval';

export default defineConfig({
    api: {
        input: './openapi/dist.yaml',
        output: {
            mode: 'tags-split',
            target: './front/src/api/generated/index.ts',
            schemas: './front/src/api/model',
            client: 'react-query',
            tsconfig: './front/tsconfig.json',
            override: {
                mutator: {
                    path: './front/src/api/client.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});
