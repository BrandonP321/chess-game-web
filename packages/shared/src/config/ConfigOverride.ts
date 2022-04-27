import { ValidConfigValue } from "./ConfigParam";

interface IConfigSystemOverrideParams {
    value: ValidConfigValue;
    enabled: boolean;
}

interface IConfigParamOverrideParams {
    value: ValidConfigValue;
    enabled: boolean;
}

export interface ValidOverrides {
    
}

/* System override only overrides enabled status of system, not any parameters */
export class ConfigSystemOverride {
    public readonly enabled: boolean;

    constructor(override: IConfigSystemOverrideParams) {
        this.enabled = override.enabled;
    }
}

export class ConfigParamOverride {
    public readonly value: ValidConfigValue;
    public readonly enabled: boolean;

    constructor(override: IConfigParamOverrideParams) {
        this.value = override.value;
        this.enabled = override.enabled;
    }
}