import {Request, Response} from "express";
import {LoginDetails} from "../model/userDetails";
import {validateUserCredentials} from "../services/user-credentials-service";
import {StatusCodes} from "../utils/StatusCodes";
import {ResponseModel} from "../model/response";
import {getNewCookieSession} from "../services/user-session-service";

export const loginHandler = async (req: Request, res: Response): Promise<ResponseModel> => {
    const loginDetails: LoginDetails = req.body;
    console.log(`Login details ${JSON.stringify(loginDetails)}`)
    const isPasswordValid: boolean = await validateUserCredentials(loginDetails);
    if (!isPasswordValid) {
        return {
            statusCode: StatusCodes.UNAUTHORIZED,
            message: "Invalid email or password"
        }
    }
    const newSessionId = await getNewCookieSession(loginDetails.emailId);
    res.cookie('sessionId', newSessionId, {
        httpOnly: true, // Ensures cookie is only accessible via HTTP(S) requests,
    });
    return {
        statusCode: StatusCodes.OK,
        message: "Login successful"
    }
};