import {Request} from "express";
import {NewUserDetailsRequest, UserDetails} from "../model/userDetails";
import {processUserDetailsCreationRequest, updateUserDetailsRequest} from "../services/user-credentials-service";
import {StatusCodes} from "../utils/StatusCodes";
import {ResponseModel} from "../model/response";

export const createUserDetailsHandler = async (request: Request): Promise<ResponseModel> => {
    const newUserDetails: UserDetails = request.body;
    const userDetails: UserDetails = await processUserDetailsCreationRequest(newUserDetails);
    return {
        statusCode: StatusCodes.CREATED,
        message: `User ${userDetails.emailId} created.`
    }
}

export const updateUserDetailsHandler = async (request: Request): Promise<ResponseModel> => {
    const emailId: string = request.params.emailId;
    const newUserDetailsRequest: NewUserDetailsRequest = request.body;
    const updatedUserDetails: NewUserDetailsRequest = await updateUserDetailsRequest(emailId, newUserDetailsRequest);
    return {
        statusCode: StatusCodes.OK,
        message: `User with email ${emailId} and first name ${updatedUserDetails.firstName} updated successfully.`
    }
}