import {Request} from "express";
import {LoginDetails} from "../model/userDetails";
import {validateUserCredentials} from "../services/user-credentials-service";
import {StatusCodes} from "../utils/StatusCodes";
import {ResponseModel} from "../model/response";

export const loginHandler = async (req: Request): Promise<ResponseModel> => {
    const loginDetails: LoginDetails = req.body;
    console.log(`Login details ${JSON.stringify(loginDetails)}`)
    const isPasswordValid: boolean = await validateUserCredentials(loginDetails);
    if (!isPasswordValid) {
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "Invalid email or password"
        }
    }
    req.session!.user = loginDetails
    return {
        statusCode: StatusCodes.OK,
        message: "Login successful"
    }
};