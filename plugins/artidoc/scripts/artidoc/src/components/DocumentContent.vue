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
    <ol>
        <li
            v-for="section in sections"
            v-bind:key="section.artifact.id"
            v-bind:id="`${section.artifact.id}`"
            v-bind:class="{ 'artidoc-section-with-add-button': has_add_button }"
        >
            <add-new-section-button
                class="artidoc-button-add-section-container"
                v-if="has_add_button"
            />
            <section-container v-bind:section="section" />
        </li>
    </ol>
    <add-new-section-button class="artidoc-button-add-section-container" v-if="has_add_button" />
</template>

<script setup lang="ts">
import { useInjectSectionsStore } from "@/stores/useSectionsStore";
import AddNewSectionButton from "@/components/AddNewSectionButton.vue";
import SectionContainer from "@/components/SectionContainer.vue";
import { strictInject } from "@tuleap/vue-strict-inject";
import { CAN_USER_EDIT_DOCUMENT } from "@/can-user-edit-document-injection-key";

const { sections } = useInjectSectionsStore();

const can_user_edit_document = strictInject<boolean>(CAN_USER_EDIT_DOCUMENT);

const has_add_button = can_user_edit_document;
</script>

<style lang="scss" scoped>
@use "@/themes/includes/whitespace";
@use "@/themes/includes/size";

$section-number-padding-left: var(--tlp-small-spacing);
$section-number-padding-right: var(--tlp-medium-spacing);
$magic-number-to-align-li-number-with-title: 13px;
$li-number-top: calc(#{$magic-number-to-align-li-number-with-title} + var(--tlp-medium-spacing));
$li-number-top-for-first-section: calc(
    #{$magic-number-to-align-li-number-with-title} + var(--tlp-large-spacing)
);
$li-number-top-with-add-button: calc(
    #{$li-number-top} + #{size.$add-section-button-container-height}
);
$li-number-top-for-first-section-with-add-button: calc(
    #{$li-number-top-for-first-section} + #{size.$add-section-button-container-height}
);

ol {
    padding: 0;
    counter-reset: item-without-dot;
}

li {
    position: relative;
    margin: 0 0 var(--tlp-medium-spacing);
    counter-increment: item-without-dot;

    &:last-child {
        margin: 0;

        > .artidoc-section-container {
            margin-bottom: 0;
        }
    }

    &:first-child {
        > .artidoc-section-container {
            padding-top: var(--tlp-large-spacing);
        }

        &::before {
            top: $li-number-top-for-first-section;
        }
    }
}

.artidoc-section-with-add-button {
    margin: 0;

    &::before {
        top: $li-number-top-with-add-button;
    }

    &:first-child::before {
        top: $li-number-top-for-first-section-with-add-button;
    }
}

li::before {
    content: counter(item-without-dot);
    position: absolute;
    top: $li-number-top;
    left: 0;
    width: calc(
        #{whitespace.$section-left-padding} - #{$section-number-padding-left} - #{$section-number-padding-right}
    );
    padding: 0 $section-number-padding-right 0 $section-number-padding-left;
    color: var(--tlp-dimmed-color-lighter-50);
    font-style: italic;
    font-weight: 600;
    text-align: right;
}
</style>
