import { AxiosResponse } from "axios";
import { ServerErrorStatusCodes } from "./StatusCodes";

export type APIErrResponse<T extends { [key: string]: any }> = {
    response: {
        data: ReturnType<T[keyof T]>;
    }
}

export const BaseRequestErrorCodes = {
    UnexpectedCondition: "UnexpectedCondition",
    UserMustReAuth: "UserMustReAuth",
} as const;

export const BaseRequestErrors = {
    UnexpectedCondition: (params?: { errMsg: string; }) => ({
        status: ServerErrorStatusCodes.InternalServerError,
        error: BaseRequestErrorCodes.UnexpectedCondition,
    }),
    UserMustReAuth: (params?: {}) => ({
        status: ServerErrorStatusCodes.InternalServerError,
        error: BaseRequestErrorCodes.UserMustReAuth,
    }),
}

export interface APIRequestResponse {
    UrlParams: {};
    ReqBody: {};
    ResBody: {};
    headers: {};
}

export type APIRequest<T extends APIRequestResponse> = (urlParams: T["UrlParams"], bodyParams: T["ReqBody"], headers: T["headers"]) => (
    Promise<AxiosResponse<T["ResBody"]>>
)

/* A protected API route attempts to refresh any expired accessTokens or execute client side code to have user re-auth if token is invalid */
export type ProtectedAPIRequest<T extends APIRequestResponse> = (
        urlParams: T["UrlParams"], 
        bodyParams: T["ReqBody"], 
        headers: T["headers"], 
        haveUserReAuth: () => void, 
        getRefreshToken: () => Promise<string | null>, 
        storeTokens: (at: string, rt: string) => Promise<boolean>
    ) => (
    Promise<AxiosResponse<T["ResBody"]>>
)