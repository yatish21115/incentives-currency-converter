import {StatusCodes} from "../StatusCodes";

export class BadRequestError extends Error {
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message);

        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}
