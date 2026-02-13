<?php

declare(strict_types=1);

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * StrongPassword Rule
 * 
 * 強力なパスワードをバリデーション。
 * 大文字、小文字、数字、特殊文字を必須とします。
 */
class StrongPassword implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (!$this->isStrong($value)) {
            $fail('The ' . $attribute . ' must contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        }
    }

    private function isStrong(string $password): bool
    {
        $hasUppercase = preg_match('/[A-Z]/', $password) === 1;
        $hasLowercase = preg_match('/[a-z]/', $password) === 1;
        $hasDigit = preg_match('/\d/', $password) === 1;
        $hasSpecial = preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password) === 1;

        return $hasUppercase && $hasLowercase && $hasDigit && $hasSpecial;
    }
}
