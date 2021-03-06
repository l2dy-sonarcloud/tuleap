<?php
/**
 * Copyright (c) Enalean, 2021-Present. All Rights Reserved.
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

namespace Tuleap\ProgramManagement\Adapter\Program\Backlog\ProgramIncrement\Source\Changeset\Values;

use Tuleap\ProgramManagement\Adapter\Workspace\Tracker\Artifact\RetrieveFullArtifact;
use Tuleap\ProgramManagement\Domain\Program\Backlog\AsynchronousCreation\TimeboxMirroringOrder;
use Tuleap\ProgramManagement\Domain\Program\Backlog\ProgramIncrement\PendingArtifactChangesetNotFoundException;
use Tuleap\ProgramManagement\Domain\Program\Backlog\ProgramIncrement\Source\Changeset\Values\GatherFieldValues;
use Tuleap\ProgramManagement\Domain\Program\Backlog\ProgramIncrement\Source\Changeset\Values\RetrieveFieldValuesGatherer;

final class FieldValuesGathererRetriever implements RetrieveFieldValuesGatherer
{
    public function __construct(
        private RetrieveFullArtifact $artifact_retriever,
        private \Tracker_FormElementFactory $form_element_factory,
    ) {
    }

    public function getFieldValuesGatherer(TimeboxMirroringOrder $order): GatherFieldValues
    {
        $full_artifact  = $this->artifact_retriever->getNonNullArtifact($order->getTimebox());
        $timebox_id     = $order->getTimebox()->getId();
        $changeset_id   = $order->getChangeset()->getId();
        $full_changeset = $full_artifact->getChangeset($changeset_id);
        if (! $full_changeset) {
            throw new PendingArtifactChangesetNotFoundException($timebox_id, $changeset_id);
        }
        return new FieldValuesGatherer(
            $full_changeset,
            $this->form_element_factory,
            new DateValueRetriever($this->form_element_factory)
        );
    }
}
