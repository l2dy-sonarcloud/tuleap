/*
 * Copyright (c) Enalean, 2024 - Present. All Rights Reserved.
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

import { describe, expect, it, vi } from "vitest";
import * as fetch from "@tuleap/fetch-result";
import { errAsync, okAsync } from "neverthrow";
import ArtidocSectionFactory from "@/helpers/artidoc-section.factory";
import { getAllSections, getSection, putArtifact } from "@/helpers/rest-querier";
import { flushPromises } from "@vue/test-utils";
import type { ArtidocSection } from "@/helpers/artidoc-section.type";
import { Fault } from "@tuleap/fault";
import { uri } from "@tuleap/fetch-result";

describe("rest-querier", () => {
    describe("getAllSections", () => {
        it("should returns retrieved sections when title is a string field", async () => {
            const section_a = ArtidocSectionFactory.create();
            const section_b = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getAllJSON").mockReturnValue(
                okAsync([
                    ArtidocSectionFactory.override({
                        ...section_a,
                        title: {
                            ...section_a.title,
                            type: "string",
                            value: "Le title A",
                        },
                    }),
                    ArtidocSectionFactory.override({
                        ...section_b,
                        title: {
                            ...section_b.title,
                            type: "string",
                            value: "Le title B",
                        },
                    }),
                ]),
            );

            let all_sections: readonly ArtidocSection[] = [];
            getAllSections(123).match(
                (sections) => {
                    all_sections = sections;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(all_sections).toHaveLength(2);
            expect(all_sections[0].display_title).toBe("Le title A");
            expect(all_sections[1].display_title).toBe("Le title B");
        });

        it("should returns retrieved sections when title is a text field in text format, replacing line breaks", async () => {
            const section_a = ArtidocSectionFactory.create();
            const section_b = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getAllJSON").mockReturnValue(
                okAsync([
                    ArtidocSectionFactory.override({
                        ...section_a,
                        title: {
                            ...section_a.title,
                            type: "text",
                            format: "text",
                            value: "Le title\r\nA",
                            post_processed_value: "Le title<br>A",
                        },
                    }),
                    ArtidocSectionFactory.override({
                        ...section_b,
                        title: {
                            ...section_b.title,
                            type: "text",
                            format: "text",
                            value: "Le title\r\nB",
                            post_processed_value: "Le title<br>B",
                        },
                    }),
                ]),
            );

            let all_sections: readonly ArtidocSection[] = [];
            getAllSections(123).match(
                (sections) => {
                    all_sections = sections;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(all_sections).toHaveLength(2);
            expect(all_sections[0].display_title).toBe("Le title A");
            expect(all_sections[1].display_title).toBe("Le title B");
        });

        it("should returns retrieved sections when title is a text field in html format, replacing line breaks", async () => {
            const section_a = ArtidocSectionFactory.create();
            const section_b = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getAllJSON").mockReturnValue(
                okAsync([
                    ArtidocSectionFactory.override({
                        ...section_a,
                        title: {
                            ...section_a.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>A</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>A</p>",
                        },
                    }),
                    ArtidocSectionFactory.override({
                        ...section_b,
                        title: {
                            ...section_b.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>B</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>B</p>",
                        },
                    }),
                ]),
            );

            let all_sections: readonly ArtidocSection[] = [];
            getAllSections(123).match(
                (sections) => {
                    all_sections = sections;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(all_sections).toHaveLength(2);
            expect(all_sections[0].display_title).toBe("Le title A");
            expect(all_sections[1].display_title).toBe("Le title B");
        });

        it("should returns retrieved sections when title is a text field in markdown format, replacing line breaks", async () => {
            const section_a = ArtidocSectionFactory.create();
            const section_b = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getAllJSON").mockReturnValue(
                okAsync([
                    ArtidocSectionFactory.override({
                        ...section_a,
                        title: {
                            ...section_a.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>A</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>A</p>",
                            commonmark: "Le title\r\nA",
                        },
                    }),
                    ArtidocSectionFactory.override({
                        ...section_b,
                        title: {
                            ...section_b.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>B</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>B</p>",
                            commonmark: "Le title\r\nB",
                        },
                    }),
                ]),
            );

            let all_sections: readonly ArtidocSection[] = [];
            getAllSections(123).match(
                (sections) => {
                    all_sections = sections;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(all_sections).toHaveLength(2);
            expect(all_sections[0].display_title).toBe("Le title A");
            expect(all_sections[1].display_title).toBe("Le title B");
        });
    });

    describe("getSection", () => {
        it("should returns retrieved section when title is a string field", async () => {
            const section = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getJSON").mockReturnValue(
                okAsync(
                    ArtidocSectionFactory.override({
                        ...section,
                        title: {
                            ...section.title,
                            type: "string",
                            value: "Le title A",
                        },
                    }),
                ),
            );

            let retrieved_section: ArtidocSection = ArtidocSectionFactory.create();
            getSection("section-id").match(
                (section) => {
                    retrieved_section = section;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(retrieved_section.display_title).toBe("Le title A");
        });

        it("should returns retrieved section when title is a text field in text format, replacing line breaks", async () => {
            const section = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getJSON").mockReturnValue(
                okAsync(
                    ArtidocSectionFactory.override({
                        ...section,
                        title: {
                            ...section.title,
                            type: "text",
                            format: "text",
                            value: "Le title\r\nA",
                            post_processed_value: "Le title<br>A",
                        },
                    }),
                ),
            );

            let retrieved_section: ArtidocSection = ArtidocSectionFactory.create();
            getSection("section-id").match(
                (section) => {
                    retrieved_section = section;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(retrieved_section.display_title).toBe("Le title A");
        });

        it("should returns retrieved section when title is a text field in html format, replacing line breaks", async () => {
            const section = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getJSON").mockReturnValue(
                okAsync(
                    ArtidocSectionFactory.override({
                        ...section,
                        title: {
                            ...section.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>A</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>A</p>",
                        },
                    }),
                ),
            );

            let retrieved_section: ArtidocSection = ArtidocSectionFactory.create();
            getSection("section-id").match(
                (section) => {
                    retrieved_section = section;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(retrieved_section.display_title).toBe("Le title A");
        });

        it("should returns retrieved section when title is a text field in markdown format, replacing line breaks", async () => {
            const section = ArtidocSectionFactory.create();
            vi.spyOn(fetch, "getJSON").mockReturnValue(
                okAsync(
                    ArtidocSectionFactory.override({
                        ...section,
                        title: {
                            ...section.title,
                            type: "text",
                            format: "html",
                            value: "<p>Le title</p>\r\n<p>A</p>",
                            post_processed_value: "<p>Le title</p>\r\n<p>A</p>",
                            commonmark: "Le title\r\nA",
                        },
                    }),
                ),
            );

            let retrieved_section: ArtidocSection = ArtidocSectionFactory.create();
            getSection("section-id").match(
                (section) => {
                    retrieved_section = section;
                },
                () => {
                    throw new Error();
                },
            );

            await flushPromises();

            expect(retrieved_section.display_title).toBe("Le title A");
        });
    });

    describe("putArtifactDescription", () => {
        it("should update artifact, when title is a string", async () => {
            const put = vi
                .spyOn(fetch, "putResponse")
                .mockReturnValue(errAsync(Fault.fromMessage("OSEF")));

            putArtifact(
                123,
                "New title",
                {
                    field_id: 1001,
                    label: "Summary",
                    type: "string",
                    value: "Old title",
                },
                "New description",
                1002,
            );

            await flushPromises();

            expect(put).toHaveBeenCalledWith(
                uri`/api/artifacts/123`,
                {},
                {
                    values: [
                        {
                            field_id: 1002,
                            value: {
                                content: "New description",
                                format: "html",
                            },
                        },
                        {
                            field_id: 1001,
                            value: "New title",
                        },
                    ],
                },
            );
        });

        it.each<[ArtidocSection["title"]]>([
            [
                {
                    field_id: 1001,
                    label: "Summary",
                    type: "text",
                    format: "text",
                    value: "Old title",
                    post_processed_value: "Old title",
                },
            ],
            [
                {
                    field_id: 1001,
                    label: "Summary",
                    type: "text",
                    format: "html",
                    value: "<p>Old title</p>",
                    post_processed_value: "<p>Old title</p>",
                },
            ],
            [
                {
                    field_id: 1001,
                    label: "Summary",
                    type: "text",
                    format: "html",
                    value: "<p>Old title</p>",
                    post_processed_value: "<p>Old title</p>",
                    commonmark: "Old title",
                },
            ],
        ])(
            "should update artifact, when title is a text field with %s",
            async (title: ArtidocSection["title"]) => {
                const put = vi
                    .spyOn(fetch, "putResponse")
                    .mockReturnValue(errAsync(Fault.fromMessage("OSEF")));

                putArtifact(123, "New title", title, "New description", 1002);

                await flushPromises();

                expect(put).toHaveBeenCalledWith(
                    uri`/api/artifacts/123`,
                    {},
                    {
                        values: [
                            {
                                field_id: 1002,
                                value: {
                                    content: "New description",
                                    format: "html",
                                },
                            },
                            {
                                field_id: 1001,
                                value: {
                                    content: "New title",
                                    format: "text",
                                },
                            },
                        ],
                    },
                );
            },
        );
    });
});
