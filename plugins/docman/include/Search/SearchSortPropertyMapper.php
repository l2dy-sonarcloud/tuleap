<?php
/**
 * Copyright (c) Enalean 2022 -  Present. All Rights Reserved.
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

namespace Tuleap\Docman\Search;

final class SearchSortPropertyMapper
{
    public const SORT_DESC = 'desc';
    public const SORT_ASC  = 'asc';

    private const LEGACY_SORT_ARRAY_MAP = [
        self::SORT_DESC => PLUGIN_DOCMAN_SORT_DESC,
        self::SORT_ASC => PLUGIN_DOCMAN_SORT_ASC,
    ];

    /**
     * @throws InvalidSortTypeException
     */
    public function convertToLegacySort(string $sort): int
    {
        if (! isset(self::LEGACY_SORT_ARRAY_MAP[$sort])) {
            throw new InvalidSortTypeException($sort);
        }
        return self::LEGACY_SORT_ARRAY_MAP[$sort];
    }
}
