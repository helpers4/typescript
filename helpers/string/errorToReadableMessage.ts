/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/*
 * This program is under the terms of the GNU Lesser General Public License version 3
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isObject } from "radashi";

/**
 * Convert an error to a readable message.
 *
 * @param error an error
 * @param stringify stringifies the error if no extractable message is found
 * @returns a readable message or a stringified error if stringify is true, otherwise undefined
 */
export function errorToReadableMessage(error: unknown, stringify: true | string): string;

/**
 * Convert an error to a readable message.
 *
 * @param error an error
 * @param stringify stringifies the error if no extractable message is found
 * @returns a readable message or a stringified error if stringify is true, otherwise undefined
 */
export function errorToReadableMessage(error?: unknown, stringify?: boolean | string): string | undefined;

/**
 * Convert an error to a readable message.
 *
 * @param error an error
 * @param stringify stringifies the error if no extractable message is found
 * @returns a readable message or a stringified error if stringify is true, otherwise undefined
 */
export function errorToReadableMessage(error?: unknown, stringify?: boolean | string): string | undefined {
    // Create a control return
    const controlReturn: (message: string | undefined) => string | undefined =
        stringify === true
            ? (a) => a ?? JSON.stringify(error)
            : typeof stringify === "string"
                ? (a) => a ?? stringify
                : (a) => a;

    // Pre-requisite: error
    if (!error) {
        return controlReturn(undefined);
    }

    // Pre-requisite: not a string
    if (typeof error === "string") {
        return error;
    }

    // Pre-requisite: an object
    if (!isObject(error)) {
        return controlReturn(String(error));
    }

    const errObj = error as object;

    // Handle nested errors
    if ("error" in errObj) {
        return errorToReadableMessage(errObj.error, stringify);
    }

    // Handle Keycloak specific errors
    if ("errorMessage" in errObj) {
        return String(errObj.errorMessage);
    }

    // Handle OpenID interception
    if ("reason" in errObj && "params" in errObj) {
        const errOAuth = error as { type: string; reason: string; params?: unknown };

        if (
            errOAuth.type === "code_error" &&
            errOAuth.params &&
            typeof errOAuth.params === "object" &&
            "error" in errOAuth.params &&
            "error_description" in errOAuth.params
        ) {
            return `${String(errOAuth.params.error)}: ${String(errOAuth.params.error_description)}`;
        }

        return `${errOAuth.type}: ${errOAuth.reason}`;
    }

    // Handle generic Error objects
    if (error instanceof Error || "message" in errObj) {
        return (error as Error).message;
    }

    // Nothing found
    return controlReturn(undefined);
}
