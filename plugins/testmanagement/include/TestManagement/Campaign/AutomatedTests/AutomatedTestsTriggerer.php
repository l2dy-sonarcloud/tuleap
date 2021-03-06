<?php
/**
 * Copyright (c) Enalean, 2018 - Present. All Rights Reserved.
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

namespace Tuleap\TestManagement\Campaign\AutomatedTests;

use Jenkins_Client;
use Tuleap\REST\JsonCast;
use Tuleap\TestManagement\Campaign\Campaign;

class AutomatedTestsTriggerer
{
    /** @var Jenkins_Client */
    private $jenkins_client;

    public function __construct(Jenkins_Client $jenkins_client)
    {
        $this->jenkins_client = $jenkins_client;
    }

    /**
     * @throws NoJobConfiguredForCampaignException
     * @throws \Jenkins_ClientUnableToLaunchBuildException
     */
    public function triggerAutomatedTests(Campaign $campaign): void
    {
        $job = $campaign->getJobConfiguration();
        $url = $job->getUrl();
        if (! $url) {
            throw new NoJobConfiguredForCampaignException();
        }

        $token = $job->getToken();
        if ($token) {
            $this->jenkins_client->setToken($token->getString());
        }

        $this->jenkins_client->launchJobBuild(
            $url,
            [
                'campaign_id' => JsonCast::toInt($campaign->getArtifact()->getId()),
                'campaign'    => $campaign->getLabel(),
            ]
        );
    }
}
