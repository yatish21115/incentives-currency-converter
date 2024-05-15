import {LoginDetails, NewUserDetailsRequest, UserDetails} from "../model/userDetails";
import {userCredentialsDao} from "../dao/user-credentials-dao";
import {compareSync, hashSync} from "bcrypt";
import {InternalServerError} from "../utils/errors/InternalServerError";
import {NotFoundError} from "../utils/errors/NotFoundError";

export const validateUserCredentials = async (loginDetails: LoginDetails) => {
    const userLoginDetails = await userCredentialsDao.getUserDetailsByEmailId(loginDetails.emailId);
    if(!userLoginDetails) return false;
    return compareSync(loginDetails.password, userLoginDetails.password);
}

export const processUserDetailsCreationRequest = async (newUserDetails: UserDetails): Promise<UserDetails> => {
    const currencyDetails: UserDetails =  {
        ...newUserDetails,
        password: hashSync(newUserDetails.password, 10),
        lastUpdatedAt: new Date().toISOString()
    }
    try{
        await userCredentialsDao.insert(currencyDetails);
    } catch (error) {
        throw new InternalServerError(`Error while registering user ${newUserDetails.emailId}`);
    }
    return currencyDetails;
}

export const updateUserDetailsRequest = async (emailId: string, newUserDetails: NewUserDetailsRequest): Promise<NewUserDetailsRequest> => {
    const oldUserDetails: UserDetails | undefined = await userCredentialsDao.getUserDetailsByEmailId(emailId);
    if(!oldUserDetails) {
        throw new NotFoundError(`Email ${emailId} provided is not linked to any user`);
    }
    const updatedUserDetails: UserDetails = {
        firstName: newUserDetails.firstName ?? oldUserDetails.firstName,
        lastName: newUserDetails.lastName ?? oldUserDetails.lastName,
        emailId: oldUserDetails.emailId,
        password: hashSync(oldUserDetails.password, 10) ?? oldUserDetails.password,
        lastUpdatedAt: new Date().toISOString()
    }
    try{
        await userCredentialsDao.insert(updatedUserDetails);
    } catch (error) {
        throw new InternalServerError(`Error while updating user details for email Id ${emailId}`);
    }
    return newUserDetails;
}
