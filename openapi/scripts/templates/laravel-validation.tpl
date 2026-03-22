<?php

declare(strict_types=1);

namespace App\__Generated__;

/**
 * OpenAPI から自動生成されたバリデーションルール。
 * 直接編集しないこと。
 */
final class OpenApiGeneratedRules
{
    /**
     * @return array<string, array<int, string>>
     */
    public static function schema(string $schema): array
    {
        return self::SCHEMA_RULES[$schema] ?? [];
    }

    /**
     * @return array<string, string>
     */
    public static function schemaAttributes(string $schema): array
    {
        return self::SCHEMA_ATTRIBUTES[$schema] ?? [];
    }

    /**
     * @var array<string, array<string, array<int, string>>>
     */
    private const SCHEMA_RULES = [
        {{rules}}
    ];

    /**
     * @var array<string, array<string, string>>
     */
    private const SCHEMA_ATTRIBUTES = [
        {{attributes}}
    ];
}
