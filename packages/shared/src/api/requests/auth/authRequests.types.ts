import { APIErrResponse } from "..";
import { UserModel } from "../../models/User.model";
import { LoginUserErrors, RegisterUserErrors } from "./authRequests.errors";

export namespace RegisterUserRequest {

    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            email: string;
            password: string;
            passwordReEnter: string;
            fullName: string;
            username: string;
        }
        ResBody: {
        } & UserModel.ShallowResponseJSON
        headers: {

        }
    }
    
    export type ErrResponse = APIErrResponse<typeof RegisterUserErrors.Errors>;
}

export namespace LoginUserRequest {
    export interface Request {
        UrlParams: {

        }
        ReqBody: {
            email: string;
            password: string;
        }
        ResBody: {

        } & UserModel.ShallowResponseJSON,
        headers: {

        }
    }

    // export type ErrResponse = ReturnType<typeof LoginUserErrors.Errors[keyof typeof LoginUserErrors.Errors]>;
    export type ErrResponse = APIErrResponse<typeof LoginUserErrors.Errors>;
}