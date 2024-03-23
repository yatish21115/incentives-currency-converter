import {StatusCodes} from "../StatusCodes";

export class NoContentError extends Error {
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message);

        this.statusCode = StatusCodes.NO_CONTENT;
    }
}
