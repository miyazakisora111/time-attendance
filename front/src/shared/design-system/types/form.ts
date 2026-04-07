/**
 * Form 系の型定義
 *
 * React Hook Form 連携に使う Trait 型。
 * フォームコンポーネント（Form, Input, Select 等）が共通で使う型を集約する。
 */
import type { FieldPath, FieldValues, UseFormProps, UseFormReturn } from "react-hook-form";
import type { WithUnstableClassName } from "./dom";

export type WithFormSubmit<T extends FieldValues> = {
    onSubmit?: (data: T) => Promise<void> | void;
};

export type WithFormMethods<T extends FieldValues> = {
    methods?: UseFormReturn<T>;
    formOptions?: UseFormProps<T>;
};

/**
 * RHF 連携フォーム入力コンポーネント共通の Props。
 * Input, Checkbox, Radio, Select, Switch, Textarea で共有する。
 */
export type FormFieldProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
} & WithUnstableClassName;
