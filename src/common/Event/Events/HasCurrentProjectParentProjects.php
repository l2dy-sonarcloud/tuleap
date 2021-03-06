<?php
/**
 * Copyright (c) Enalean, 2021 - present. All Rights Reserved.
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

namespace Tuleap\Event\Events;

use Tuleap\Event\Dispatchable;

class HasCurrentProjectParentProjects implements Dispatchable
{
    public const NAME = 'hasCurrentProjectParentProjects';

    private \Project $project;

    private bool $has_parents = false;

    public function __construct(\Project $project)
    {
        $this->project = $project;
    }

    public function getProject(): \Project
    {
        return $this->project;
    }

    public function setHasParents(): void
    {
        $this->has_parents = true;
    }

    public function hasProjectAtLeastOneParentProject(): bool
    {
        return $this->has_parents;
    }
}
