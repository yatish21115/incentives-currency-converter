import {StatusCodes} from "../StatusCodes";

export class backendErrors extends Error {
    public statuscode: StatusCodes

    constructor(message: string, statuscode: StatusCodes) {
        super(message);
        this.statuscode = statuscode;
    }
}

export class NoContentError extends Error {
    constructor(message: string) {
        super(message);
    }
}