/**
 * Exported items from codegen that need to be accessbile to other packaes in monorepo
 */
import { EnvUtils } from "../utils/EnvUtils";

import liveConfig from "./codegen/MasterConfig.live.json";
import devConfig from "./codegen/MasterConfig.dev.json";
import stageConfig from "./codegen/MasterConfig.stage.json";
import localConfig from "./codegen/MasterConfig.local.json";

type ValidConfig = typeof localConfig;

const allConfigs: { [key: string]: ValidConfig } = {
    live: liveConfig,
    dev: devConfig,
    stage: stageConfig,
    local: localConfig
}

const { CurrentEnvironment } = EnvUtils;

// because we know that every config will have the same parameters, 
// we can just annotate the type of MasterConfig as the type of any of the configs, defaulting to the live config to be safe
export const MasterConfig = (typeof CurrentEnvironment === "string" && allConfigs[CurrentEnvironment]) ? allConfigs[CurrentEnvironment] : allConfigs["live"];
