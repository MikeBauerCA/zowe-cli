/*
* This program and the accompanying materials are made available under the terms of the
* Eclipse Public License v2.0 which accompanies this distribution, and is available at
* https://www.eclipse.org/legal/epl-v20.html
*
* SPDX-License-Identifier: EPL-2.0
*
* Copyright Contributors to the Zowe Project.
*
*/

// Test Environment populated in the beforeAll();
import { ITestEnvironment } from "../../../../../../../__tests__/__src__/environment/doc/response/ITestEnvironment";
import { TestEnvironment } from "../../../../../../../__tests__/__src__/environment/TestEnvironment";
import { runCliScript } from "../../../../../../../__tests__/__src__/TestUtils";
import * as fs from "fs";
import { TestProperties } from "../../../../../../../__tests__/__src__/properties/TestProperties";
import { ITestSystemSchema } from "../../../../../../../__tests__/__src__/properties/ITestSystemSchema";

let TEST_ENVIRONMENT: ITestEnvironment;

describe("provisioning list catalog-templates", () => {

    // Create the unique test environment
    beforeAll(async () => {
        TEST_ENVIRONMENT = await TestEnvironment.setUp({
            testName: "provisioning_list_catalog-templates",
            tempProfileTypes: ["zosmf"]
        });
    });

    it("should display template catalog", async () => {
        const regex = fs.readFileSync(__dirname + "/__regex__/catalog_templates_response.regex").toString();
        const response = runCliScript(__dirname + "/__scripts__/catalogTemplates.sh", TEST_ENVIRONMENT);
        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(new RegExp(regex, "g").test(response.stdout.toString())).toBe(true);
    });

    describe("without profiles", () => {

        // Create a separate test environment for no profiles
        let TEST_ENVIRONMENT_NO_PROF: ITestEnvironment;
        let DEFAULT_SYSTEM_PROPS: ITestSystemSchema;

        beforeAll(async () => {
            TEST_ENVIRONMENT_NO_PROF = await TestEnvironment.setUp({
                testName: "provisioning_catalog_templates_without_profiles"
            });

            const sysProps = new TestProperties(TEST_ENVIRONMENT_NO_PROF.systemTestProperties);
            DEFAULT_SYSTEM_PROPS = sysProps.getDefaultSystem();
        });

        afterAll(async () => {
            await TestEnvironment.cleanUp(TEST_ENVIRONMENT_NO_PROF);
        });

        it("should display template catalog", async () => {
            const regex = fs.readFileSync(__dirname + "/__regex__/catalog_templates_response.regex").toString();
            const response = runCliScript(__dirname + "/__scripts__/catalogTemplates_fully_qualified.sh",
                TEST_ENVIRONMENT_NO_PROF,
                [
                    DEFAULT_SYSTEM_PROPS.zosmf.host,
                    DEFAULT_SYSTEM_PROPS.zosmf.port,
                    DEFAULT_SYSTEM_PROPS.zosmf.user,
                    DEFAULT_SYSTEM_PROPS.zosmf.pass
                ]);
            expect(response.stderr.toString()).toBe("");
            expect(response.status).toBe(0);
            expect(new RegExp(regex, "g").test(response.stdout.toString())).toBe(true);
        });
    });
});
