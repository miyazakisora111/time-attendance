<?php

declare(strict_types=1);

namespace App\Models;

use App\__Generated__\Enums\LanguageCode;
use App\__Generated__\Enums\ThemeType;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ユーザー設定のモデル
 */
class UserSetting extends BaseModel
{
    /**
     * {@inheritdoc}
     */
    protected $table = 'user_settings';

    /**
     * {@inheritdoc}
     */
    protected $fillable = [
        'user_id',
        'theme',
        'language',
    ];

    /**
     * {@inheritdoc}
     */
    protected $casts = [
        'theme' => ThemeType::class,
        'language' => LanguageCode::class,
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * ユーザー設定に紐づくユーザー
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
