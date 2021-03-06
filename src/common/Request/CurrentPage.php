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

namespace Tuleap\Request;

class CurrentPage
{
    public function isDashboard(): bool
    {
        return $this->isPersonalDashboard() || $this->isProjectDashboard();
    }

    private function isPersonalDashboard(): bool
    {
        $is_managing_bookmarks = strpos($_SERVER['REQUEST_URI'], '/my/bookmark') === 0;

        return ! $is_managing_bookmarks && strpos($_SERVER['REQUEST_URI'], '/my/') === 0;
    }

    /**
     * @deprecated See \Tuleap\Dashboard\Project\ProjectDashboardIsDisplayed
     */
    private function isProjectDashboard(): bool
    {
        return strpos($_SERVER['REQUEST_URI'], '/projects/') === 0;
    }
}
