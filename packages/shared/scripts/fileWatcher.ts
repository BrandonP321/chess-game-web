/**
 * Watches for file changes on specified files/directories and executes provided script on change.
 * Does not work on Linux machines,
 * CURRENTLY USING NODEMON UNTIL I FIGURE OUT WHY NODE-WATCH ISN'T WORKING
 */

import { generateMasterConfig } from "./generateMasterConfig";

// build a config file for each environment
generateMasterConfig("live");
generateMasterConfig("dev");
generateMasterConfig("stage");
generateMasterConfig("local");