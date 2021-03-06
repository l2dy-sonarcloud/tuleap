/*
 * Copyright (c) Enalean, 2020-Present. All Rights Reserved.
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

import type { html as HTMLTemplateStringProcessor } from "lit/html.js";
import type { LinkSelector, LinkSelectorOptions } from "./type";
import * as creator from "./link-selector";
import "../themes/style.scss";

export type { HTMLTemplateResult } from "lit/html.js";
export type { HTMLTemplateStringProcessor, LinkSelector, LinkSelectorOptions };
export type { LinkSelectorSelectionCallback, LinkSelectorSearchFieldCallback } from "./type";
export type { GroupCollection, GroupOfItems, LinkSelectorItem } from "./items/GroupCollection";

export function createLinkSelector(
    source_select_box: HTMLSelectElement,
    options: LinkSelectorOptions
): LinkSelector {
    return creator.createLinkSelector(source_select_box, options);
}
