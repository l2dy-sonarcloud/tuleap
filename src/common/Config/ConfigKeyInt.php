<?php
/*
 * Copyright (c) Enalean, 2022-Present. All Rights Reserved.
 *
 * This file is a part of Tuleap.
 *
 * Tuleap is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Tuleap is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Tuleap. If not, see <http://www.gnu.org/licenses/>.
 *
 */

declare(strict_types=1);

namespace Tuleap\Config;

/**
 * @psalm-immutable
 */
#[\Attribute(\Attribute::TARGET_CLASS_CONSTANT)]
final class ConfigKeyInt implements ConfigKeyType
{
    public function __construct(public ?int $default_value)
    {
    }

    /**
     * @psalm-assert-if-true !null $this->default_value
     */
    public function hasDefaultValue(): bool
    {
        return $this->default_value !== null;
    }

    public function getSerializedRepresentation(string $name, string|int|bool $value): string
    {
        if (! is_numeric($value)) {
            throw new \LogicException('Cannot accept non int values');
        }
        return sprintf('$%s = %d;%s', $name, $value, PHP_EOL);
    }
}
