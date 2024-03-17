import {ValidationChain, validationResult} from "express-validator";
import {NextFunction, Response, Request} from "express";
import {isObjectEmpty} from "../utils/common";


export const validateSchema = <T>(validations: ValidationChain[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(isObjectEmpty(req.body)) {
            res.status(400).json({ error: "Invalid request, please provide correct details." });
        }
        Promise.all(validations.map(validation => validation.run(req))).then(() => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            next();
        });
    };
};

export const filterEmptyFields = (req: any, fields: string[]) => {
    return fields.filter(field => !req.body[field]);
};

export const filterNonStringFields = (req: any, fields: string[]) => {
    return fields.filter(field => typeof req.body[field] !== 'string');
};

export const generateParameterRequiredMessage = (emptyFields: string[]) => {
    return `${emptyFields.join(', ')} ${emptyFields.length > 1 ? 'are' : 'is'} required`;
};

export const generateNotValidStringMessage = (nonStringFields: string[]) => {
    return `${nonStringFields.join(', ')} ${nonStringFields.length > 1 ? 'are' : 'is'} not a valid string`;
};