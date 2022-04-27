import { LoginUserRequest, RegisterUserRequest } from "../requests/auth";
import { GetUserRequest } from "../requests/user/userRequests.types";

/**
 * URL params must be identical to those in the request type in the
 * corresponding <route>.types.ts file
 */

export const AuthRoutes = {
    RegisterUser: (params?: RegisterUserRequest.Request["UrlParams"]) => "/api/auth/register",
    LoginUser: (params?: LoginUserRequest.Request["UrlParams"]) => "/api/auth/login",
}

export const UserRoutes = {
    GetUser: (params?: GetUserRequest.Request["UrlParams"]) => `/api/user/${params?.id ?? ":id"}`,
}

export const Routes = {
    ...AuthRoutes,
    ...UserRoutes,
}

export type ValidRoute = keyof typeof Routes;