/*
 * Copyright (c) Enalean, 2022-Present. All Rights Reserved.
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

import type { RetrieveLinkedArtifactsSync } from "./RetrieveLinkedArtifactsSync";
import type { VerifyLinkIsMarkedForRemoval } from "./VerifyLinkIsMarkedForRemoval";
import type { RetrieveNewLinks } from "./RetrieveNewLinks";
import type { VerifyHasParentLink } from "./VerifyHasParentLink";
import { IS_CHILD_LINK_TYPE } from "@tuleap/plugin-tracker-constants";
import { REVERSE_DIRECTION } from "./LinkType";
import type { ParentArtifactIdentifier } from "../../parent/ParentArtifactIdentifier";

export const ParentLinkVerifier = (
    links_retriever: RetrieveLinkedArtifactsSync,
    marked_for_removal_verifier: VerifyLinkIsMarkedForRemoval,
    new_links_retriever: RetrieveNewLinks,
    parent_identifier: ParentArtifactIdentifier | null
): VerifyHasParentLink => ({
    hasParentLink(): boolean {
        if (parent_identifier) {
            return true;
        }
        const has_non_removed_parent = links_retriever
            .getLinkedArtifacts()
            .some(
                (link) =>
                    link.link_type.shortname === IS_CHILD_LINK_TYPE &&
                    link.link_type.direction === REVERSE_DIRECTION &&
                    !marked_for_removal_verifier.isMarkedForRemoval(link)
            );
        const has_new_parent = new_links_retriever
            .getNewLinks()
            .some(
                (link) =>
                    link.link_type.shortname === IS_CHILD_LINK_TYPE &&
                    link.link_type.direction === REVERSE_DIRECTION
            );

        return has_new_parent || has_non_removed_parent;
    },
});
