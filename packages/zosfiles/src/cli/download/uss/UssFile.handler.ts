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

import { ZosFilesBaseHandler } from "../../ZosFilesBase.handler";
import { AbstractSession, IHandlerParameters } from "@zowe/imperative";
import { IZosFilesResponse } from "../../../api";
import { Download } from "../../../api/methods/download";


/**
 * Handler to download an uss file
 * @export
 */
export default class UssFileHandler extends ZosFilesBaseHandler {
    public async processWithSession(commandParameters: IHandlerParameters, session: AbstractSession): Promise<IZosFilesResponse> {
        return Download.ussFile(session, commandParameters.arguments.ussFileName, {
            binary: commandParameters.arguments.binary,
            file: commandParameters.arguments.file
        });
    }
}
