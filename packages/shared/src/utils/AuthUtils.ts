import { RegexUtils } from "./RegexUtils";
import { LoginUserRequest, RegisterUserRequest } from "../api/requests/auth";

export type TRegistrationFields = RegisterUserRequest.Request["ReqBody"] & { passwordReEnter: string };
// type of registration data passed in to validation function
export type TAllRegistrationFields = {[key in keyof TRegistrationFields]: string};
// this needs to be it's own type so we can include the passwords not matching as an input err
export type TRegistrationErrFields = keyof TRegistrationFields | "matchingPasswords";

export const registrationFieldsConstraints: { [key in keyof Required<TRegistrationFields>]: { required: boolean; errMsg: string; regex?: RegExp } } = {
    email: { required: true, errMsg: "Please provide a valid email.", regex: RegexUtils.emailRegex },
    password: { required: true, errMsg: "Please provide a valid password.", regex: RegexUtils.passwordRegex },
    passwordReEnter: { required: true, errMsg: "Please re-enter your password." },
    fullName: { required: true, errMsg: "Please enter your name." },
    username: { required: true, errMsg: "Please provide a valid username." },
}

export type TLoginFields = LoginUserRequest.Request["ReqBody"];
export const loginFieldConstraints: { [key in keyof Required<TLoginFields>]: { errMsg: string; } } = {
    email: { errMsg: "Please provide an email." },
    password: { errMsg: "Please provide a password." }
}
export type TLoginErrFields = keyof TLoginFields;

export class AuthUtils {
    /* returns error object if user did not provide correct input for registration */
    public static validateRegistrationFields(fields: TAllRegistrationFields): { msg: string; field: TRegistrationErrFields } | undefined {
        // for each form field, verify it has correct input from user
        let f: keyof TRegistrationFields;
        for (f in fields) {
            const field = registrationFieldsConstraints[f];
            const value = fields[f];

            // obj to be returned if there is an error with the user's input
            const fieldErrObj = { msg: field.errMsg, field: f }
            
            if (field.required && !value) {
                // if field is required but user gave no value
                return fieldErrObj
            } else if (value && !!field.regex) {
                // if user input a value, verify regex if applicable
                if (!field.regex.test(value)) {
                    return fieldErrObj
                }
            }
        }

        if (fields.password !== fields.passwordReEnter) {
            return { msg: "Passwords must match.", field: "matchingPasswords" }
        }
    }

    public static validateLoginFields(fields: TLoginFields): { msg: string; field: TLoginErrFields } | undefined {
        // verify user provided a value for each login field
        let f: keyof TLoginFields;
        for (f in fields) {
            const field = loginFieldConstraints[f];

            if (!fields[f]) {
                return { msg: field.errMsg, field: f };
            }
        }
    }
}