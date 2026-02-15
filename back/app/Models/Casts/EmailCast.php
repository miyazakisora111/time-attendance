<?php

namespace App\Model\Casts;

use App\ValueObjects\Email;

/**
 * Eメールのキャストクラス
 */
class EmailCast extends ValueObjectCast
{
    /**
     * {@inheritdoc}
     */
    protected function valueObjectClass(): string
    {
        return Email::class;
    }
}
