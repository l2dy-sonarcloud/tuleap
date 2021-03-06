<?php
/**
 * Copyright (c) Enalean, 2019 - Present. All Rights Reserved.
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

namespace Tuleap\Tracker\Semantic\Timeframe;

use Tracker;
use Tracker_FormElement_Field_Date;
use Tracker_FormElement_Field_Numeric;
use Tuleap\Tracker\FormElement\Field\ArtifactLink\ArtifactLinkFieldValueDao;
use Tuleap\Tracker\FormElement\Field\ArtifactLink\LinksRetriever;
use Tuleap\Tracker\Semantic\TimeframeConfigInvalid;

class SemanticTimeframeBuilder
{
    private SemanticTimeframeDao $dao;

    private \Tracker_FormElementFactory $form_element_factory;

    private \TrackerFactory $tracker_factory;

    private LinksRetriever $links_retriever;

    public function __construct(
        SemanticTimeframeDao $dao,
        \Tracker_FormElementFactory $form_element_factory,
        \TrackerFactory $tracker_factory,
        LinksRetriever $links_retriever,
    ) {
        $this->dao                  = $dao;
        $this->form_element_factory = $form_element_factory;
        $this->tracker_factory      = $tracker_factory;
        $this->links_retriever      = $links_retriever;
    }

    public static function build(): self
    {
        return new self(
            new SemanticTimeframeDao(),
            \Tracker_FormElementFactory::instance(),
            \TrackerFactory::instance(),
            new LinksRetriever(
                new ArtifactLinkFieldValueDao(),
                \Tracker_ArtifactFactory::instance()
            )
        );
    }

    /**
     * @throws TimeframeBrokenConfigurationException
     */
    public function getSemantic(Tracker $tracker): SemanticTimeframe
    {
        $row = $this->dao->searchByTrackerId($tracker->getId());
        if ($row === null) {
            return $this->buildTimeframeSemanticNotConfigured($tracker);
        }

        if (isset($row['implied_from_tracker_id'])) {
            return $this->buildSemanticTimeframeImpliedFromAnotherTracker($tracker, $row['implied_from_tracker_id']);
        }

        $start_date_field = $this->form_element_factory->getUsedDateFieldById(
            $tracker,
            (int) $row['start_date_field_id']
        );

        if ($start_date_field === null) {
            return $this->buildTimeframeSemanticNotConfigured($tracker);
        }

        if ($row['duration_field_id'] !== null) {
            $duration_field = $this->form_element_factory->getUsedFieldByIdAndType(
                $tracker,
                (int) $row['duration_field_id'],
                ['int', 'float', 'computed']
            );
            assert($duration_field instanceof Tracker_FormElement_Field_Numeric);

            return new SemanticTimeframe($tracker, new TimeframeWithDuration($start_date_field, $duration_field));
        }

        if ($row['end_date_field_id'] !== null) {
            $end_date_field = $this->form_element_factory->getUsedDateFieldById(
                $tracker,
                (int) $row['end_date_field_id']
            );
            assert($end_date_field instanceof Tracker_FormElement_Field_Date);

            return new SemanticTimeframe($tracker, new TimeframeWithEndDate($start_date_field, $end_date_field));
        }

        return $this->buildTimeframeSemanticNotConfigured($tracker);
    }

    private function buildSemanticTimeframeImpliedFromAnotherTracker(Tracker $tracker, int $implied_from_tracker_id): SemanticTimeframe
    {
        $implied_from_tracker = $this->tracker_factory->getTrackerById($implied_from_tracker_id);
        if ($implied_from_tracker === null) {
            return $this->buildTimeframeSemanticNotConfigured($tracker);
        }

        if ($implied_from_tracker->getProject()->getID() !== $tracker->getProject()->getID()) {
            return $this->buildTimeframeSemanticConfigInvalid($tracker);
        }

        $implied_semantic = $this->getSemantic($implied_from_tracker);
        if ($implied_semantic->isTimeframeNotConfiguredNorImplied()) {
            return $this->buildTimeframeSemanticNotConfigured($tracker);
        }

        return new SemanticTimeframe(
            $tracker,
            new TimeframeImpliedFromAnotherTracker(
                $tracker,
                $implied_semantic,
                $this->links_retriever
            )
        );
    }

    public function buildTimeframeSemanticNotConfigured(Tracker $tracker): SemanticTimeframe
    {
        return new SemanticTimeframe(
            $tracker,
            new TimeframeNotConfigured()
        );
    }

    private function buildTimeframeSemanticConfigInvalid(Tracker $tracker): SemanticTimeframe
    {
        return new SemanticTimeframe(
            $tracker,
            new TimeframeConfigInvalid()
        );
    }
}
