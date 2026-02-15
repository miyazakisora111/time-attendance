<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * UserResource
 * 
 * ユーザーモデルをJSON形式に変換するリソースクラス。
 * API レスポンスの形式を統一します。
 */
class UserResource extends JsonResource
{
    /**
     * リソースを配列に変換
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'department' => $this->department,
            'position' => $this->position,
            'status' => [
                'value' => $this->status->value,
                'label' => $this->status->label(),
            ],
            'metadata' => $this->metadata,
            'last_login_at' => $this->last_login_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
