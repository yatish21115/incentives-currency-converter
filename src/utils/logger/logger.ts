import { generateTrace } from "./generateTrace";

enum LEVEL {
    DEBUG = 10,
    INFO = 20,
    WARN = 30,
    ERROR = 40,
    CRITICAL = 50,
}

const log: {[key:string]: ()=>void} = {
    DEBUG: Function.prototype.bind.call(console.debug, console),
    INFO: Function.prototype.bind.call(console.info, console),
    WARN: Function.prototype.bind.call(console.warn, console),
    ERROR: Function.prototype.bind.call(console.error, console),
    CRITICAL: Function.prototype.bind.call(console.error, console)
};

const level = (process.env.LogLevel ?? "INFO").toUpperCase() as unknown as LEVEL;
const LogLevel = Number.parseInt(LEVEL[level]);

type ConsoleParams = { [key: string]: any; }[];

export class Logger {
    #customerID?: string;
    #upin?: string;
    #requestID?: string;
    #startTime: number = Date.now();
    #namespace: string;
    #tags: string[];

    constructor(namespace: string, tags: string[]) {
        this.#namespace = namespace;
        this.#tags = tags;
    }

    public setStartTime() {
        this.#startTime = Date.now();
    }

    public setCustomerInformation(CustomerID: string) {
        this.#customerID = CustomerID;
    }

    public setUserInformation(UPIN: string) {
        this.#upin = UPIN;
    }

    public setRequestID(id: string) {
        this.#requestID = id;
    }

    public tag(tag: string): Logger {
        const tags = tag.split(",");

        return new Logger(this.#namespace, this.#tags.concat(tags));
    }

    public log(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.DEBUG);
    }

    public debug(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.DEBUG);
    }

    public info(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.INFO);
    }

    public warn(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.WARN);
    }

    public error(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.ERROR);
    }

    public critical(msg: string, ...data: ConsoleParams): void {
        this._log(msg, data, LEVEL.CRITICAL);
    }

    private async _log(msg: string, data: ConsoleParams, level: LEVEL = LEVEL.DEBUG) {
        if (level >= LogLevel) {
            const trace = generateTrace(this._log, true);
            data = this.extractError(data);
            const formattedData = this.formatData(msg, data, level, trace);
            log[LEVEL[level]].apply(console, [this.stringify(formattedData, false)] as any);
        }
    }

    private stringify(data: { [key: string]: any }, pretty: boolean = false): string {
        const params: any = [data];

        if (pretty) {
            params.push(null, 4);
        }

        return JSON.stringify.apply(JSON, params);
    }

    private extractError(data: ConsoleParams) {
        return data.map((item) => {
            if ("error" in item) {
                const error: any = item["error"];

                if (error instanceof Error) {
                    item["error"] = undefined;
                    item["errorMessage"] = error.message;
                    item["errorType"] = error.name ?? "Error";
                    item["trace"] = error.stack;
                }
            }

            return item;
        });
    }

    private formatData(msg: string, data: ConsoleParams, level: LEVEL = LEVEL.DEBUG, trace: any): { [key: string]: any } {
        const formattedData: { [key: string]: any } = {};

        Object.assign(formattedData, ...data);

        formattedData["namespace"] = this.#namespace;
        formattedData["time_elapsed"] = `${Math.round((Date.now() - this.#startTime) / 10) / 100}s`;
        formattedData["tags"] = this.#tags;
        formattedData["message"] = msg;
        formattedData["customer_id"] = formattedData["customer_id"] ?? this.#customerID;
        formattedData["upin"] = formattedData["upin"] ?? this.#upin;
        formattedData["request_id"] = formattedData["request_id"] ?? this.#requestID;
        formattedData["log_trace"] = trace;

        return formattedData;
    }
}

export function LoggerFactory(namespace: string, tags: string[] = []): Logger {
    return new Logger(namespace, tags);
}

export const REGION: string = process.env.AWS_REGION || "us-east-1";
export const ServiceName: string = process.env.ServiceName || "yatish-currency-converter";

export const logger = LoggerFactory(process.env.AWS_LAMBDA_FUNCTION_NAME! ?? ServiceName, [ServiceName, REGION]);
