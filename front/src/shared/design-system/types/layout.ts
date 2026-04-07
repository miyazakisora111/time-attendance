/**
 * Layout / Slot 系の型定義
 *
 * children や polymorphic パターン（asChild）など、
 * コンポーネントの構造・スロットに関する Trait 型。
 */
import type React from "react";

export type WithChildren = {
    children?: React.ReactNode;
};

/**
 * Radix UI の asChild パターン。
 * true の場合、子要素に props を委譲する。
 */
export type WithAsChild = {
    asChild?: boolean;
};
