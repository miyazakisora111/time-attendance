
/**
 * {{description}}
 * @source openapi/components/enums/{{name}}.yaml
 */
export const {{ name }} =[
    {{ cases }}
] as const;
export type {{ name }} = (typeof {{ name }})[number];
