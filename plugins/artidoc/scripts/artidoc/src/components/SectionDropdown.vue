<!--
- Copyright (c) Enalean, 2024 - present. All Rights Reserved.
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
-
-->
<template>
    <div class="tlp-dropdown">
        <button
            type="button"
            v-bind:title="trigger_title"
            class="tlp-button-secondary tlp-button-outline artidoc-dropdown-trigger"
            data-test="artidoc-dropdown-trigger"
            ref="trigger"
        >
            <i class="fa-solid fa-ellipsis-vertical fa-fw" role="img"></i>
        </button>
        <div class="tlp-dropdown-menu tlp-dropdown-menu-on-icon" role="menu">
            <a v-bind:href="artifact_url" class="tlp-dropdown-menu-item" role="menuitem">
                <i
                    class="tlp-dropdown-menu-item-icon fa-solid fa-fw fa-arrow-right"
                    aria-hidden="true"
                ></i>
                {{ $gettext("Go to artifact") }}
            </a>
            <template v-if="is_section_editable">
                <span class="tlp-dropdown-menu-separator" role="separator"></span>
                <a
                    v-bind:href="artifact_url"
                    v-on:click="edit"
                    type="button"
                    class="tlp-dropdown-menu-item"
                    role="menuitem"
                    v-bind:class="{ 'tlp-dropdown-menu-item-disabled': is_edit_mode }"
                    v-bind:title="edit_title"
                    data-test="edit"
                >
                    <i
                        class="fa-solid tlp-dropdown-menu-item-icon fa-pen-to-square fa-fw"
                        aria-hidden="true"
                    ></i>
                    <span>{{ $gettext("Edit") }}</span>
                </a>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SectionEditor } from "@/composables/useSectionEditor";
import { useGettext } from "vue3-gettext";
import type { ArtidocSection } from "@/helpers/artidoc-section.type";
import type { Dropdown } from "@tuleap/tlp-dropdown";
import { createDropdown } from "@tuleap/tlp-dropdown";
import { computed, onMounted, ref } from "vue";

const { $gettext } = useGettext();
const props = defineProps<{
    editor: SectionEditor;
    section: ArtidocSection;
}>();
const { enableEditor } = props.editor.editor_actions;
const { is_section_editable } = props.editor;
const is_edit_mode = props.editor.isSectionInEditMode();
const artifact_url = `/plugins/tracker/?aid=${props.section.artifact.id}`;
const trigger = ref<HTMLElement | null>(null);

const edit_title = computed(() =>
    is_edit_mode.value ? $gettext("Section is currently being edited") : "",
);

const trigger_title = $gettext("Open contextual menu");

let dropdown: Dropdown | null = null;

onMounted(() => {
    if (trigger.value) {
        dropdown = createDropdown(trigger.value);
    }
});

function edit(event: Event): void {
    event.preventDefault();
    enableEditor();
    if (dropdown) {
        dropdown.hide();
    }
}
</script>

<style lang="scss" scoped>
@use "@tuleap/burningparrot-theme/css/includes/global-variables";

$button-size: 24px;

.tlp-dropdown {
    position: sticky;
    top: calc(var(--tlp-small-spacing) + #{global-variables.$navbar-height});
    align-self: flex-start;
    margin: var(--tlp-small-spacing) 0 0;
}

.artidoc-dropdown-trigger {
    width: $button-size;
    height: $button-size;
    padding: 0;
    border: var(--tuleap-artidoc-section-background);
    border-radius: 50%;
    background: var(--tuleap-artidoc-section-background);
    box-shadow: none;

    &:focus {
        box-shadow: var(--tlp-shadow-focus);
    }
}
</style>
