import { BaseRequestErrorCodes, BaseRequestErrors } from "..";
import { ClientErrorStatusCodes } from "../StatusCodes";

export namespace GetUserErrors {

    export const ErrorCodes = {
        ...BaseRequestErrorCodes,
        UserNotFound: "UserNotFound",
    } as const;

    export const Errors = {
        ...BaseRequestErrors,
        UserNotFound: (params?: {}) => ({
            status: ClientErrorStatusCodes.NotFound,
            error: ErrorCodes.UserNotFound
        })
    } as const;
};