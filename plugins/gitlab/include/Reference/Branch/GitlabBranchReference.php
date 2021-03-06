<?php
/**
 * Copyright (c) Enalean, 2021-Present. All Rights Reserved.
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

declare(strict_types=1);

namespace Tuleap\Gitlab\Reference\Branch;

use Project;
use Tuleap\Gitlab\Repository\GitlabRepositoryIntegration;

class GitlabBranchReference extends \Reference
{
    public const REFERENCE_NAME = 'gitlab_branch';
    public const NATURE_NAME    = 'plugin_gitlab_branch';

    public function __construct(
        GitlabRepositoryIntegration $repository_integration,
        Project $project,
        string $branch_name,
    ) {
        parent::__construct(
            0,
            self::REFERENCE_NAME,
            dgettext('tuleap-gitlab', 'GitLab branch'),
            $repository_integration->getGitlabRepositoryUrl() . '/-/tree/' . urlencode($branch_name),
            'S',
            'plugin_gitlab',
            'plugin_gitlab',
            true,
            (int) $project->getID()
        );
    }
}
