import { StatusCodes } from "../StatusCodes";

export class BadGatewayError extends Error {
  statusCode: StatusCodes;

  constructor(message: string) {
    super(message);

    this.statusCode = StatusCodes.BAD_GATEWAY;
  }
}