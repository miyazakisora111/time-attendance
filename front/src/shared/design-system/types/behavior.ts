/**
 * 非同期・状態系の型定義
 *
 * ローディング、無効化など、コンポーネントの振る舞いに関する Trait 型。
 */

export type WithLoading = {
    loading?: boolean;
};

export type WithDisabled = {
    disabled?: boolean;
};
