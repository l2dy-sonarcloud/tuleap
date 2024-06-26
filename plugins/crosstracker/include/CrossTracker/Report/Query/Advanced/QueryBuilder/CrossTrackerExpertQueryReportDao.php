<?php
/**
 * Copyright (c) Enalean, 2017 - Present. All Rights Reserved.
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

namespace Tuleap\CrossTracker\Report\Query\Advanced\QueryBuilder;

use ParagonIE\EasyDB\EasyStatement;
use Tuleap\CrossTracker\Report\Query\Advanced\SelectBuilder\IProvideParametrizedSelectAndFromSQLFragments;
use Tuleap\DB\DataAccessObject;
use Tuleap\Tracker\Report\Query\IProvideParametrizedFromAndWhereSQLFragments;

final class CrossTrackerExpertQueryReportDao extends DataAccessObject
{
    public function searchArtifactsMatchingQuery(
        IProvideParametrizedFromAndWhereSQLFragments $from_where,
        array $tracker_ids,
        $limit,
        $offset,
    ) {
        $from  = $from_where->getFrom();
        $where = $from_where->getWhere();

        $tracker_ids_statement = EasyStatement::open()->in('tracker_artifact.tracker_id IN (?*)', $tracker_ids);

        $sql = <<<EOSQL
        SELECT
            SQL_CALC_FOUND_ROWS
            DISTINCT
            tracker_artifact.tracker_id,
            tracker_artifact.id,
            tracker_changeset_value_title.value AS title
        FROM tracker_artifact
        INNER JOIN tracker ON (tracker_artifact.tracker_id = tracker.id)
        INNER JOIN tracker_changeset AS last_changeset ON (tracker_artifact.last_changeset_id = last_changeset.id)
        LEFT JOIN (
            tracker_changeset_value AS changeset_value_title
            INNER JOIN tracker_semantic_title
                ON (tracker_semantic_title.field_id = changeset_value_title.field_id)
            INNER JOIN tracker_changeset_value_text AS tracker_changeset_value_title
                ON (tracker_changeset_value_title.changeset_value_id = changeset_value_title.id)
        ) ON (
            tracker_semantic_title.tracker_id = tracker_artifact.tracker_id
            AND changeset_value_title.changeset_id = tracker_artifact.last_changeset_id
        )
        $from
        WHERE $tracker_ids_statement AND $where
        ORDER BY tracker_artifact.id DESC
        LIMIT ?, ?
        EOSQL;

        $parameters = [
            ...$from_where->getFromParameters(),
            ...$tracker_ids_statement->values(),
            ...$from_where->getWhereParameters(),
            $offset,
            $limit,
        ];

        return $this->getDB()->safeQuery($sql, $parameters);
    }

    /**
     * @return list<array{id: int}>
     */
    public function searchArtifactsIdsMatchingQuery(
        IProvideParametrizedFromAndWhereSQLFragments $from_where,
        array $tracker_ids,
        int $limit,
        int $offset,
    ): array {
        $from  = $from_where->getFrom();
        $where = $from_where->getWhere();

        $tracker_ids_statement = EasyStatement::open()->in('tracker_artifact.tracker_id IN (?*)', $tracker_ids);

        $sql = <<<EOSQL
        SELECT SQL_CALC_FOUND_ROWS DISTINCT tracker_artifact.id AS id
        FROM tracker_artifact
        INNER JOIN tracker ON (tracker_artifact.tracker_id = tracker.id)
        INNER JOIN tracker_changeset AS last_changeset ON (tracker_artifact.last_changeset_id = last_changeset.id)
        LEFT JOIN (
            tracker_changeset_value AS changeset_value_title
            INNER JOIN tracker_semantic_title
                ON (tracker_semantic_title.field_id = changeset_value_title.field_id)
            INNER JOIN tracker_changeset_value_text AS tracker_changeset_value_title
                ON (tracker_changeset_value_title.changeset_value_id = changeset_value_title.id)
        ) ON (
            tracker_semantic_title.tracker_id = tracker_artifact.tracker_id
            AND changeset_value_title.changeset_id = tracker_artifact.last_changeset_id
        )
        $from
        WHERE $tracker_ids_statement AND $where
        LIMIT ?, ?
        EOSQL;

        $parameters = [
            ...$from_where->getFromParameters(),
            ...$tracker_ids_statement->values(),
            ...$from_where->getWhereParameters(),
            $offset,
            $limit,
        ];

        return $this->getDB()->q($sql, ...$parameters);
    }

    /**
     * @param list<int> $artifact_ids
     */
    public function searchArtifactsColumnsMatchingIds(
        IProvideParametrizedSelectAndFromSQLFragments $select_from,
        array $artifact_ids,
    ): array {
        $select    = $select_from->getSelect();
        $from      = $select_from->getFrom();
        $condition = EasyStatement::open()->in('artifact.id IN (?*)', $artifact_ids);

        if ($select !== '') {
            $select = ', ' . $select;
        }

        $sql = <<<SQL
        SELECT DISTINCT artifact.id
        $select
        FROM tracker_artifact AS artifact
        INNER JOIN tracker ON (artifact.tracker_id = tracker.id)
        INNER JOIN tracker_changeset AS changeset ON (changeset.id = artifact.last_changeset_id)
        $from
        WHERE $condition
        ORDER BY artifact.id DESC
        SQL;

        $parameters = [
            ...$select_from->getFromParameters(),
            ...$artifact_ids,
        ];

        return $this->getDB()->q($sql, ...$parameters);
    }
}
