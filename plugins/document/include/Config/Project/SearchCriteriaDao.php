<?php
/**
 * Copyright (c) Enalean, 2022 - Present. All Rights Reserved.
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
 */

declare(strict_types=1);

namespace Tuleap\Document\Config\Project;

final class SearchCriteriaDao extends \Tuleap\DB\DataAccessObject implements IUpdateCriteria, IRetrieveCriteria
{
    /**
     * @return string[]
     */
    public function searchByProjectId(int $project_id): array
    {
        return $this->getDB()->first(
            'SELECT name
            FROM plugin_document_search_criteria
            WHERE project_id = ?
            ORDER BY id ASC',
            $project_id
        );
    }

    public function saveCriteria(int $project_id, array $criteria): void
    {
        $this->getDB()->tryFlatTransaction(function () use ($project_id, $criteria) {
            $this->getDB()->delete(
                'plugin_document_search_criteria',
                [
                    'project_id' => $project_id,
                ]
            );

            $this->getDB()->insertMany(
                'plugin_document_search_criteria',
                array_map(static fn($name) => ['name' => $name, 'project_id' => $project_id], $criteria),
            );
        });
    }
}
