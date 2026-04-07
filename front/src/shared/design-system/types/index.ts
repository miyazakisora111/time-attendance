/**
 * Design System 共通型
 *
 * コンポーネント Props を「意味単位の小さな Trait 型」として定義し、
 * extends の合成で Props を構成するための基盤。
 *
 * @example
 * ```ts
 * import type { StrictHTMLProps, WithUnstableClassName, WithAsChild } from "@/shared/design-system/types";
 *
 * export interface ButtonProps
 *   extends StrictButtonProps,
 *     VariantProps<typeof buttonVariants>,
 *     WithAsChild,
 *     WithUnstableClassName {}
 * ```
 */

// DOM
export type {
    StrictHTMLProps,
    StrictButtonProps,
    StrictInputProps,
    StrictSelectProps,
    StrictTextareaProps,
    StrictLabelProps,
    WithUnstableClassName,
} from "./dom";

// Layout / Slot
export type { WithChildren, WithAsChild } from "./layout";

// Behavior
export type { WithLoading, WithDisabled } from "./behavior";

// Form
export type {
    WithFormSubmit,
    WithFormMethods,
    FormFieldProps,
} from "./form";
