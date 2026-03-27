<?php

declare(strict_types=1);

namespace App\Models;

use App\__Generated__\Enums\ThemeType;
use App\__Generated__\Enums\LanguageCode;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserSetting extends BaseModel
{
    use HasFactory;

    protected $table = 'user_settings';

    /**
     * UUID primary key
     */
    protected $keyType = 'string';
    public $incrementing = false;

    /**
     * Mass assignment
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
     * User relation
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * ダークテーマ判定
     */
    public function isDarkTheme(): bool
    {
        return $this->theme === 'dark';
    }

    /**
     * 日本語判定
     */
    public function isJapanese(): bool
    {
        return $this->language === 'ja';
    }
}
