import {StatusCodes} from "../StatusCodes";

export class ForbiddenError extends Error {
    statusCode: StatusCodes;

    constructor(message: string) {
        super(message);

        this.statusCode = StatusCodes.FORBIDDEN;
    }
}
