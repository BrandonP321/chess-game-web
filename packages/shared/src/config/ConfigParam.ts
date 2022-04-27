import { ConfigParamOverride } from "./ConfigOverride";

export type ValidConfigValue = string | boolean;
export type ValidParamOverrides = "live" | "dev" | "local" | "stage";

export interface IConfigParamParams {
    value: ValidConfigValue;
    enabled: boolean;
    description?: string;
    overrides?: { [key in ValidParamOverrides]?: ConfigParamOverride };
}

interface IConfigParam extends IConfigParamParams {
}

export class ConfigParam implements IConfigParam {
    public value;
    public enabled;
    public overrides;

    constructor(params: IConfigParamParams) {
        this.value = params.value;
        this.enabled = params.enabled;
        this.overrides = params.overrides;
    }

    /* returns value of parameter or override value if override is specified */
    public getParamValue(env: ValidParamOverrides) {
        return this.overrides?.[env]?.value ?? this.value;
    }
}