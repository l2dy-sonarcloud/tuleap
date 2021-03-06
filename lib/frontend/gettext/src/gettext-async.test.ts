/*
 * Copyright (c) Enalean, 2019-Present. All Rights Reserved.
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

import {
    initGettext,
    getPOFileFromLocale,
    getPOFileFromLocaleWithoutExtension,
} from "./gettext-async";

jest.mock("node-gettext");

describe("initGettext", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    it("instantiates Gettext with given locale and domain", async () => {
        const load_translations_callback = jest.fn();
        const gettext_provider = await initGettext(
            "en_US",
            "my-domain",
            load_translations_callback
        );

        expect(gettext_provider.setLocale).toHaveBeenCalledWith("en_US");
        expect(gettext_provider.setTextDomain).toHaveBeenCalledWith("my-domain");
        expect(gettext_provider.addTranslations).not.toHaveBeenCalled();
        expect(load_translations_callback).not.toHaveBeenCalled();
    });

    it("calls function to load external translation", async () => {
        const gettext_provider = await initGettext("fr_FR", "my-domain", (locale) =>
            Promise.resolve({ headers: { Language: locale }, translations: {} })
        );

        expect(gettext_provider.addTranslations).toHaveBeenCalledWith("fr_FR", "my-domain", {
            headers: { Language: "fr_FR" },
            translations: {},
        });
    });

    describe(`getPOFileFromLocale`, () => {
        it("does not reject string looking like actual locale ID string", () => {
            expect(getPOFileFromLocale("fr_FR")).toBe("fr_FR.po");
        });

        it("rejects string that does not look like locale ID string", () => {
            expect(() => getPOFileFromLocale("not_a_locale")).toThrow();
        });
    });

    describe(`getPOFileFromLocaleWithoutExtension`, () => {
        it("does not reject string looking like actual locale ID string", () => {
            expect(getPOFileFromLocaleWithoutExtension("fr_FR")).toBe("fr_FR");
        });

        it("rejects string that does not look like locale ID string", () => {
            expect(() => getPOFileFromLocaleWithoutExtension("not_a_locale")).toThrow();
        });
    });
});
