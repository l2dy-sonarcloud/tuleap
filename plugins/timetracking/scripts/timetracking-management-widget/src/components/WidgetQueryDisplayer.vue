<!--
  - Copyright (c) Enalean, 2024 - Present. All Rights Reserved.
  -
  - This file is a part of Tuleap.
  -
  - Tuleap is free software; you can redistribute it and/or modify
  - it under the terms of the GNU General Public License as published by
  - the Free Software Foundation; either version 2 of the License, or
  - (at your option) any later version.
  -
  - Tuleap is distributed in the hope that it will be useful,
  - but WITHOUT ANY WARRANTY; without even the implied warranty of
  - MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  - GNU General Public License for more details.
  -
  - You should have received a copy of the GNU General Public License
  - along with Tuleap. If not, see <http://www.gnu.org/licenses/>.
  -->

<template>
    <div class="timetracking-management-query-displayer">
        <div class="timetracking-management-query-displayer-dates">
            <div>
                <label class="tlp-label">{{ $gettext("From") }}</label>
                <span data-test="start-date">{{ props.start_date }}</span>
            </div>
            <div>
                <label class="tlp-label">{{ $gettext("To") }}</label>
                <span data-test="end-date">{{ props.end_date }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGettext } from "vue3-gettext";

const { $gettext } = useGettext();

const props = defineProps<{
    start_date: string;
    end_date: string;
}>();
</script>

<style scoped lang="scss">
.timetracking-management-query-displayer {
    padding: var(--tlp-medium-spacing);

    &:hover {
        background-color: var(--tlp-main-color-transparent-90);
        cursor: pointer;
    }
}

.timetracking-management-query-displayer-dates {
    display: flex;
    gap: var(--tlp-medium-spacing);
}
</style>
