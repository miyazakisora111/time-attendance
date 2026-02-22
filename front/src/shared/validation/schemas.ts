import { z } from 'zod';
import { validationMessages } from '@/shared/validation/messages';

// 必須文字列
export const requiredStringSchema = () =>
  z.string().nonempty(validationMessages.required());

// 最小文字列
export const minLengthStringSchema = (min: number) =>
  z.string().min(min, validationMessages.minLength(min));

// 最大文字列
export const maxLengthStringSchema = (max: number) =>
  z.string().max(max, validationMessages.maxLength(max));

// メール
export const emailSchema = z.string().nonempty(validationMessages.required()).email(validationMessages.email());

// パスワード
export const passwordSchema = z.string()
  .nonempty(validationMessages.required())
  .min(8, validationMessages.minLength(8))
  .regex(/[A-Z]/, validationMessages.Upper())
  .regex(/[a-z]/, validationMessages.Lower())
  .regex(/[0-9]/, validationMessages.Number())
  .regex(/[\W_]/, validationMessages.Symbol());

// 電話番号
export const phoneSchema = z.string().regex(/^\+?\d{1,4}?[-.\s]?(\d{1,3}?[-.\s]?){1,4}$/, validationMessages.phone());

// URL
export const urlSchema = z.string().url(validationMessages.url());

// 日付
export const dateSchema = z.string().refine(val => !isNaN(Date.parse(val)), { message: validationMessages.date() });

// 数値バリデーション共通
const baseNumberSchema = z.preprocess((val) => {
  if (val === '' || val === null || val === undefined) return undefined; // 空は undefined に
  const n = Number(val);
  return isNaN(n) ? val : n;
}, z.number({ invalid_type_error: validationMessages.number() }));

// 最小値のみ
export const minNumberSchema = (min: number, isOptional = false) => {
  let schema = baseNumberSchema.min(min, validationMessages.min(min));
  if (isOptional) schema = schema.optional();
  return schema;
};

// 最大値のみ
export const maxNumberSchema = (max: number, isOptional = false) => {
  let schema = baseNumberSchema.max(max, validationMessages.max(max));
  if (isOptional) schema = schema.optional();
  return schema;
};

// 範囲指定
export const numberInRangeSchema = (min: number, max: number, isOptional = false) => {
  let schema = baseNumberSchema.min(min, validationMessages.min(min)).max(max, validationMessages.max(max));
  if (isOptional) schema = schema.optional();
  return schema;
};

// optional 文字列
export const optionalStringSchema = (min?: number, max?: number) => stringSchema(min, max).optional();
