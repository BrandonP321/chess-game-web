const SharedEnvVars = {
    
} as const;

export const ServerEnvVars = {
    ...SharedEnvVars,
    PORT: "PORT",
    MONGODB_URI: "MONGODB_URI",
    ACCESS_TOKEN_SECRET: "ACCESS_TOKEN_SECRET",
    REFRESH_TOKEN_SECRET: "REFRESH_TOKEN_SECRET",
    SECRET: "SECRET",
    API_URL: "API_URL",
    ENV: "ENV",
} as const;

export const WebEnvVars = {
    ...SharedEnvVars,
    REACT_APP_API_URL: "API_URL",
    REACT_APP_ENV: "REACT_APP_ENV",
} as const;

const EnvVars = {
    ...ServerEnvVars,
    ...WebEnvVars,
} as const;

type ValidEnvVar = keyof typeof EnvVars;

export class EnvUtils {
    public static get isLive() { return EnvUtils.CurrentEnvironment === "live" }
    public static get isLocal() { return EnvUtils.CurrentEnvironment === "local" }

    /**
     * Returns value of specified env variable
     * @param v Environment variable
     * @param defaultValue Optional default value if env variable doesn't exist
     */
    public static getEnvVar(v: ValidEnvVar): string | undefined;
    public static getEnvVar(v: ValidEnvVar, defaultValue: string): typeof defaultValue;
    public static getEnvVar(v: ValidEnvVar, defaultValue?: string) {
        return process.env[v]?.toString() ?? defaultValue;
    }

    /* returns current environment site is running in (i.e. local, live, etc.) */
    public static get CurrentEnvironment() {
        return EnvUtils.getEnvVar(ServerEnvVars.ENV, EnvUtils.getEnvVar(WebEnvVars.REACT_APP_ENV, "live"));
    }
}