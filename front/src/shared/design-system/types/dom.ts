/**
 * DOM Props の型定義
 *
 * Design System コンポーネントが HTML 属性を受け取るための基盤型。
 * className を直接公開せず、unstableClassName のみを escape hatch として許可する。
 */
import type React from "react";

// ─── Strict HTML Props ───────────────────────────────────
// className を除外した HTML 属性。DS コンポーネントは className を直接受け取らない。

export type StrictHTMLProps<T extends HTMLElement> = Omit<
    React.HTMLAttributes<T>,
    "className"
>;

export type StrictButtonProps = Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "className"
>;

export type StrictInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "className"
>;

export type StrictSelectProps = Omit<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    "className"
>;

export type StrictTextareaProps = Omit<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    "className"
>;

export type StrictLabelProps = Omit<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    "className"
>;

// ─── Unstable ClassName ──────────────────────────────────

export type WithUnstableClassName = {
    /**
     * Design System 制約を破るための escape hatch。
     * 通常のスタイリングにはバリアントを使用すること。
     */
    unstableClassName?: string;
};
