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
 * along with Tuleap. If not, see http://www.gnu.org/licenses/.
 *
 */

import { shallowMount } from "@vue/test-utils";
import { createStoreMock } from "@tuleap/vuex-store-wrapper-jest";
import localVue from "../../../../helpers/local-vue";
import ObsolescenceDatePropertyForUpdate from "./ObsolescenceDatePropertyForUpdate.vue";
import moment from "moment/moment";

describe("ObsolescenceDatePropertyForUpdate", () => {
    let properties_factory, state, store;
    beforeEach(() => {
        state = {
            configuration: { is_obsolescence_date_property_used: false },
        };

        const store_options = { state };

        store = createStoreMock(store_options);

        properties_factory = (props = {}) => {
            return shallowMount(ObsolescenceDatePropertyForUpdate, {
                localVue,
                propsData: { ...props },
                mocks: { $store: store },
            });
        };
    });
    describe("Component display", () => {
        it(`Displays the component if the obsolescence date property is used`, async () => {
            const wrapper = properties_factory();

            store.state.configuration.is_obsolescence_date_property_used = true;
            await wrapper.vm.$nextTick();

            expect(wrapper.find("[data-test=obsolescence-date-property]").exists()).toBeTruthy();
        });
        it(`Does not display the component if the obsolescence date property is not used`, async () => {
            const wrapper = properties_factory();

            store.state.configuration.is_obsolescence_date_property_used = false;
            await wrapper.vm.$nextTick();

            expect(wrapper.find("[data-test=obsolescence-date-property]").exists()).toBeFalsy();
        });
    });
    describe(`Should link flat picker and select helper`, () => {
        it(`Obsolescence date should be null if the option "permanent" is chosen by the user`, async () => {
            const wrapper = properties_factory({ value: "" });
            store.state.configuration.is_obsolescence_date_property_used = true;
            await wrapper.vm.$nextTick();

            const select = wrapper.get("[data-test=document-obsolescence-date-select-update]");
            select.trigger("change");

            expect(wrapper.vm.selected_value).toBe("permanent");
            expect(wrapper.vm.obsolescence_date).toBeNull();
        });
        it(`Obsolescence date should be the current day + 3 months if the option "3months" is chosen by the user`, async () => {
            const wrapper = properties_factory({ value: "" });
            store.state.configuration.is_obsolescence_date_property_used = true;
            await wrapper.vm.$nextTick();

            wrapper.findAll("option").at(1).element.selected = true;

            wrapper.get("[data-test=document-obsolescence-date-select-update]").trigger("change");

            const current_date = moment().format("YYYY-MM-DD");

            const expected_date = moment(current_date, "YYYY-MM-DD")
                .add(3, "M")
                .format("YYYY-MM-DD");

            expect(wrapper.vm.selected_date_value).toBe("3");
            expect(wrapper.vm.date_value).toEqual(expected_date);
        });
    });
    describe(`Binding between the select box and the date input`, () => {
        it(`When the user click on the date input then the value of the select should be 'Fixed date`, () => {
            const wrapper = properties_factory({ value: "" });
            store.state.configuration.is_obsolescence_date_property_used = true;

            expect(wrapper.vm.selected_value).toBe("permanent");
            wrapper.vm.obsolescence_date = "2019-09-07";

            expect(wrapper.vm.selected_value).toBe("fixed");
        });
    });
});
