import { ControllerUtils } from "./ControllerUtils";
import jwt from "jsonwebtoken";
import { EnvUtils, ServerEnvVars } from "@chess-game/shared/src/utils/EnvUtils";
import type { Request, Response } from "express";
import { ConfigUtils } from "@chess-game/shared/src/utils/ConfigUtils";
import { MasterConfig } from "@chess-game/shared/src/config";

export type IVerifiedTokenResponse = ({
    userId: string;
    jwtHash: string;
} & ({
    isExpired: true;
} | {
    isExpired: false;
    token: jwt.JwtPayload;
})) | undefined

const accessTokenExpirationTime = ConfigUtils.getParam(MasterConfig.JWTSettings.AccessTokenExpirationTime, "100000");
const refreshTokenExpirationTime = ConfigUtils.getParam(MasterConfig.JWTSettings.AccessTokenExpirationTime, "100000");

export class JWTUtils {
    private static signToken(userId: string, isRefreshToken: boolean, hash: string, expiresIn?: string) {
        const tokenSecret = EnvUtils.getEnvVar(isRefreshToken ? ServerEnvVars.REFRESH_TOKEN_SECRET : ServerEnvVars.ACCESS_TOKEN_SECRET);

        if (!tokenSecret) {
            return undefined;
        }

        const signOptions: jwt.SignOptions = {
            /* sub -> id of user */
            subject: userId,
            /* jti -> unique hash to enforce refresh tokens are only used once */
            jwtid: hash
        }

        if (expiresIn) {
            signOptions.expiresIn = expiresIn;
        }

        return jwt.sign({}, tokenSecret, signOptions)
    }

    public static signAccessToken (userId: string, hash: string, expiresIn?: string) {
        return JWTUtils.signToken(userId, false, hash, expiresIn ?? accessTokenExpirationTime);
    }

    public static signRefreshToken(userId: string, hash: string, expiresIn?: string) {
        return JWTUtils.signToken(userId, true, hash, expiresIn ?? refreshTokenExpirationTime);
    }

    private static verifyToken(token: string | null, secret: string | undefined): IVerifiedTokenResponse {
        if (!secret || !token) {
            console.error("Error getting SECRET Env Variable or refresh token not found");
            return undefined
        }

        try {
            const verifiedToken = jwt.verify(token, secret)
            const tokenIsString = typeof verifiedToken === "string";

            if (tokenIsString || !verifiedToken.sub || !verifiedToken.jti) {
                return undefined;
            }

            return {
                token: verifiedToken,
                isExpired: false,
                userId: verifiedToken.sub,
                jwtHash: verifiedToken.jti
            }
        } catch (err) {
            // error will be thrown if token is expired
            const decodedToken = jwt.decode(token);

            if (typeof decodedToken === "string" || !decodedToken || !decodedToken.sub || !decodedToken.jti) {
                return undefined;
            }

            return { 
                isExpired: true, 
                userId: decodedToken.sub,
                jwtHash: decodedToken.jti
            };
        }
    }

    public static verifyAccessToken(token: string | null) {
        const ACCESS_TOKEN_SECRET = EnvUtils.getEnvVar(ServerEnvVars.ACCESS_TOKEN_SECRET);

        return this.verifyToken(token, ACCESS_TOKEN_SECRET);
    }

    public static verifyRefreshToken(token: string | null) {
        const REFRESH_TOKEN_SECRET = EnvUtils.getEnvVar(ServerEnvVars.REFRESH_TOKEN_SECRET);

        return this.verifyToken(token, REFRESH_TOKEN_SECRET);
    }

    public static setTokenHeader(token: string, res: Response) {
        return ControllerUtils.setResponseHeader("authorization", `Bearer ${token}`, res);
    }

    public static getTokenFromHeader(req: Request<any>) {
        const token = req.headers.authorization?.split(" ")[1];

        return token;
    }

    public static getTokenFromCookie(req: Request): { accessToken: string; refreshToken: string } | undefined {
        try {
            const cookie = JSON.parse(req.cookies?.siteTokens);
        
            if (cookie) {
                return {
                    accessToken: cookie.accessToken,
                    refreshToken: cookie.refreshToken
                }
            }
        } catch (err) {
            return undefined
        }
    }
}
