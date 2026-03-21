// This file is auto-generated. Do not edit manually.
// Source: openapi/build/bundle.json + front/src/__generated__/zod.ts + field-labels.json

import { z } from 'zod';
import { components as generatedComponents } from './zod';
import labelsJson from './field-labels.json';

const labels = labelsJson as Record<string, string>;
const labelOf = (field: string): string => labels[field] ?? field;

export const validationSchemas = {
    {{schemas}}
} as const ;

export type ValidationSchemaName = keyof typeof validationSchemas;
