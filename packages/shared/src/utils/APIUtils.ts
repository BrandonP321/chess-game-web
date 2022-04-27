import { ConfigUtils } from "./ConfigUtils";
import { MasterConfig } from "../config";

export class APIUtils {
    public static getApiDomain = () => {
        // TODO: update default value
        return ConfigUtils.getParam(MasterConfig.ConnectionSettings.ClientAPIUrlString, "./env");
    }
}