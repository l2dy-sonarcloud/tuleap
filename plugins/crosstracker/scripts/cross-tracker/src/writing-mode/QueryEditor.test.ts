/*
 * Copyright (c) Enalean, 2018-Present. All Rights Reserved.
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

import type { VueWrapper } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import { getGlobalTestOptions } from "../helpers/global-options-for-tests";
import QueryEditor from "./QueryEditor.vue";
import WritingCrossTrackerReport from "./writing-cross-tracker-report";

const noop = (): void => {
    //Do nothing
};

describe("QueryEditor", () => {
    function instantiateComponent(
        writingCrossTrackerReport: WritingCrossTrackerReport,
    ): VueWrapper<InstanceType<typeof QueryEditor>> {
        return shallowMount(QueryEditor, {
            props: {
                writingCrossTrackerReport,
            },
            global: { ...getGlobalTestOptions({}) },
        });
    }

    it("Displays a code mirror integration", () => {
        const writingCrossTrackerReport = new WritingCrossTrackerReport();
        writingCrossTrackerReport.expert_query = "@title = 'foo'";

        const wrapper = instantiateComponent(writingCrossTrackerReport);
        expect(wrapper.vm.value).toBe(writingCrossTrackerReport.expert_query);
    });

    it("Update the report when query is updated", () => {
        jest.spyOn(document, "createRange").mockImplementation(() => {
            return {
                getBoundingClientRect: noop,
                setEnd: noop,
                setStart: noop,
                getClientRects: () => [],
            } as unknown as Range;
        });

        const writingCrossTrackerReport = new WritingCrossTrackerReport();
        writingCrossTrackerReport.expert_query = "@title = 'foo'";
        const wrapper = instantiateComponent(writingCrossTrackerReport);

        wrapper.vm.code_mirror_instance?.setValue("@title = 'bar'");
        expect(writingCrossTrackerReport.expert_query).toBe("@title = 'bar'");
    });
});
