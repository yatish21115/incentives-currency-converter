import {StatusCodes} from "../StatusCodes";

export class NotFoundError extends Error {
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message);

        this.statusCode = StatusCodes.NOT_FOUND;
    }
}
