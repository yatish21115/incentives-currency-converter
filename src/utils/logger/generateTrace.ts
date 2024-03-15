/*******************************************************************************
 * Copyright (c) 2023.
 * This  code file/snippet/block, including any other configuration files,
 * is for the sole use of the Evive Health, LLC and may contain business
 * confidential and privileged information.
 * Any unauthorized review, use, disclosure or distribution is prohibited.
 *
 ******************************************************************************/

// https://github.com/v8/v8/wiki/Stack-Trace-API
interface CallSite {
    getThis(): any;
    getTypeName(): string | null;
    getMethodName(): string;
    getFileName(): string;
    getFunction(): string;
    getFunctionName(): string;
    getLineNumber(): number;
    getColumnNumber(): number;
    getEvalOrigin(): string;
    isToplevel(): boolean;
    isEval(): boolean;
    isNative(): boolean;
    isConstructor(): boolean;
    isAsync(): boolean;
    isPromiseAll(): boolean;
    getPromiseIndex(): number;
    getScriptNameOrSourceURL(): string;
}

if (!process.env.JEST_WORKER_ID) {
    (Error as any)["prepareStackTrace"] = (_: Error, stack: CallSite[]) => {
        return stack.map((trace) => ({
            function_name: trace.getFunctionName() || "anonymous",
            file: {
                name: trace.getFileName(),
                location: {
                    line: trace.getLineNumber(),
                    column: trace.getColumnNumber()
                }
            }
        }));
    };
}

export function generateTrace(constructorOpt: Function, removeFirstStack: boolean = false) {
    const error = new Error;

    (Error as any)["captureStackTrace"](error, constructorOpt);

    const stack = error.stack;

    return stack;
}
