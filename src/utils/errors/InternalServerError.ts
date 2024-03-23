import {StatusCodes} from "../StatusCodes";

export class InternalServerError extends Error {
  statusCode: StatusCodes;

  constructor(message: string) {
    super(message);

    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}
