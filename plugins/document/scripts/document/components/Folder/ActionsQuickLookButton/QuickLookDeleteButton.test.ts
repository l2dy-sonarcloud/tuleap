/*
 * Copyright (c) Enalean, 2019 - present. All Rights Reserved.
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

import type { Wrapper } from "@vue/test-utils";
import { shallowMount } from "@vue/test-utils";
import QuickLookDeleteButton from "./QuickLookDeleteButton.vue";
import { createStoreMock } from "@tuleap/vuex-store-wrapper-jest";
import localVue from "../../../helpers/local-vue";
import type { Item } from "../../../type";
import emitter from "../../../helpers/emitter";

jest.mock("../../../helpers/emitter");

describe("QuickLookDeleteButton", () => {
    function createWrapper(
        user_can_write: boolean,
        can_user_manage: boolean,
        is_deletion_allowed: boolean,
        forbid_writers_to_delete: boolean
    ): Wrapper<QuickLookDeleteButton> {
        return shallowMount(QuickLookDeleteButton, {
            mocks: {
                $store: createStoreMock({
                    state: {
                        configuration: { is_deletion_allowed, forbid_writers_to_delete },
                    },
                }),
            },
            localVue,
            propsData: { item: { id: 1, user_can_write, can_user_manage } as Item },
        });
    }

    it(`Displays the delete button because the user can write and has the right to delete items`, () => {
        const wrapper = createWrapper(true, false, true, false);
        expect(wrapper.find("[data-test=document-quick-look-delete-button]").exists()).toBeTruthy();
    });
    it(`Does not display the delete button if the user can't write but has the right to delete items`, () => {
        const wrapper = createWrapper(false, false, true, false);
        expect(wrapper.find("[data-test=document-quick-look-delete-button]").exists()).toBeFalsy();
    });
    it(`Does not display the delete button if the user can write but cannot to delete items`, () => {
        const wrapper = createWrapper(true, false, false, false);
        expect(wrapper.find("[data-test=document-quick-look-delete-button]").exists()).toBeFalsy();
    });
    it(`Does not display the delete button if deletion by Writers is forbidden and current user is writer`, () => {
        const wrapper = createWrapper(true, false, true, true);
        expect(wrapper.find("[data-test=document-quick-look-delete-button]").exists()).toBeFalsy();
    });
    it(`Displays the delete button if deletion by Writers is forbidden and current user is manager`, () => {
        const wrapper = createWrapper(true, true, true, true);
        expect(wrapper.find("[data-test=document-quick-look-delete-button]").exists()).toBeTruthy();
    });

    it(`When the user clicks the button, then it should trigger an event to open the confirmation modal`, () => {
        const wrapper = createWrapper(true, false, true, false);
        wrapper.get("[data-test=document-quick-look-delete-button]").trigger("click");

        expect(emitter.emit).toHaveBeenCalledWith("deleteItem", {
            item: {
                id: 1,
                user_can_write: true,
                can_user_manage: false,
            },
        });
    });
});
