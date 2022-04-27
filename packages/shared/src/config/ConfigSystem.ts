import { ConfigParam } from "./ConfigParam";

interface IConfigSystemParams {
    enabled: boolean;
    description?: string;
}

interface ISubSystemAndParams {
    [key: string]: ConfigSystem | ConfigParam;
}

interface IConfigSystem extends IConfigSystemParams {
    subSystemsAndParams: ISubSystemAndParams;
}

export class ConfigSystem implements IConfigSystem {
    public enabled;
    public description;
    public subSystemsAndParams;

    constructor(params: IConfigSystemParams, subSystemsAndParams: ISubSystemAndParams) {
        this.enabled = params.enabled;
        this.description = params.description;
        this.subSystemsAndParams = subSystemsAndParams;
    }

    public getSubSystemsAndParams = () => {
        const subSystems: { name: string; system: ConfigSystem; }[] = []
        const subParams: { name: string; param: ConfigParam; }[] = []
        const subKeys = Object.keys(this.subSystemsAndParams);

        for (let key of subKeys) {
            const paramOrSystem = this.subSystemsAndParams[key];

            if (paramOrSystem instanceof ConfigSystem) {
                subSystems.push({ name: key, system: paramOrSystem });
            } else {
                subParams.push({ name: key, param: paramOrSystem });
            }
        }

        return {
            systems: subSystems,
            params: subParams
        }
    }
}