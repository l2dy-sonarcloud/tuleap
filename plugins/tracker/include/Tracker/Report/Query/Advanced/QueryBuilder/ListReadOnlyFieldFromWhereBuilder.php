<?php
/**
 * Copyright (c) Enalean, 2017 - Present. All Rights Reserved.
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
 * along with Tuleap; if not, write to the Free Software
 * Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
 */

namespace Tuleap\Tracker\Report\Query\Advanced\QueryBuilder;

use Tracker_FormElement_Field;
use Tuleap\Tracker\Report\Query\Advanced\CollectionOfListValuesExtractor;
use Tuleap\Tracker\Report\Query\Advanced\FieldFromWhereBuilder;
use Tuleap\Tracker\Report\Query\Advanced\Grammar\Comparison;
use Tuleap\Tracker\Report\Query\IProvideFromAndWhereSQLFragments;

class ListReadOnlyFieldFromWhereBuilder implements FieldFromWhereBuilder
{
    /**
     * @var FromWhereComparisonFieldReadOnlyBuilder
     */
    private $from_where_builder;

    /**
     * @var ListReadOnlyConditionBuilder
     */
    private $condition_builder;

    /**
     * @var CollectionOfListValuesExtractor
     */
    private $values_extractor;

    public function __construct(
        CollectionOfListValuesExtractor $values_extractor,
        FromWhereComparisonFieldReadOnlyBuilder $from_where_builder,
        ListReadOnlyConditionBuilder $condition_builder,
    ) {
        $this->values_extractor   = $values_extractor;
        $this->from_where_builder = $from_where_builder;
        $this->condition_builder  = $condition_builder;
    }

    /**
     * @return IProvideFromAndWhereSQLFragments
     */
    public function getFromWhere(Comparison $comparison, Tracker_FormElement_Field $field)
    {
        $values    = $this->values_extractor->extractCollectionOfValues($comparison->getValueWrapper(), $field);
        $condition = $this->condition_builder->getCondition($values);

        return $this->from_where_builder->getFromWhere($condition);
    }
}
