<?php

declare(strict_types=1);

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * BaseRequest
 * 
 * すべてのリクエストクラスの基底クラス。
 * 共通の機能と初期化を提供します。
 */
abstract class BaseRequest extends FormRequest
{
    /**
     * リクエストが認可されているかを判断
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * バリデーションルール
     */
    abstract public function rules(): array;

    /**
     * エラーメッセージ
     */
    public function messages(): array
    {
        return [];
    }

    /**
     * 検証前の入力値を準備
     */
    protected function prepareForValidation(): void
    {
        // 子クラスでオーバーライド可能
    }
}
