import axios from "axios";
import { UserRoutes } from "../../routes";
import { APIRequest } from "..";
import { APIUtils } from "../../../utils/APIUtils";
import { GetUserRequest } from "./userRequests.types";

const APIDomain = APIUtils.getApiDomain();

export const GetUser: APIRequest<GetUserRequest.Request> = (urlParams, bodyParams, headers) => {
    return axios.get(`${APIDomain}${UserRoutes.GetUser(urlParams)}`, {withCredentials: true})
}