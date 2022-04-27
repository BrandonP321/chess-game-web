import { ValidConfigValue } from "../config/ConfigParam";

interface IConfigParam {
    enabled: boolean;
    value: ValidConfigValue;
}

interface IConfigSystem {
    enabled: boolean;
    [key: string]: IConfigParam | boolean;
}

export class ConfigUtils {
    /* returns param value or default value if param is disabled */
    public static getParam(param: IConfigParam, defaultValue: string): string;
    public static getParam(param: IConfigParam, defaultValue: ValidConfigValue): ValidConfigValue;
    public static getParam(param: IConfigParam, defaultValue: ValidConfigValue): ValidConfigValue {

        return param?.enabled ? param?.value : defaultValue;
    }

    /* returns a  boolean for the 'enabled' status of a given system */
    public static getSystemStatus(system: IConfigSystem) {
        return system.enabled;
    };
}