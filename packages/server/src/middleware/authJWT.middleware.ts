import { IVerifiedTokenResponse, JWTUtils } from "~Utils/JWTUtils";
import { RouteMiddleware } from ".";
import { NextFunction, Request, Response } from "express";
import mongoose, { NativeError } from "mongoose";
import { ControllerUtils, MongooseUtils } from "~Utils";
import bcrypt from "bcrypt";
import db from "~Models";
import { UserModel } from "@chess-game/shared/src/api/models/User.model";
import { BaseRequestErrors } from "@chess-game/shared/src/api/requests";
import { EnvUtils, ServerEnvVars } from "@chess-game/shared/src/utils/EnvUtils";
import { TObjectId } from "@chess-game/shared/src/api/models";

// other properties that will exist in Request object
export interface IAuthJWTResLocals {
    user: {
        id: TObjectId;
    }
}

/* middleware function to authenticate user via a jwt sent in a cookie with the request */
export const authenticateJWT: RouteMiddleware<{ UrlParams: {}, ReqBody: {}, ResBody: {} }, IAuthJWTResLocals> = (req, res, next) => {
    try {
        const { accessToken, refreshToken } = JWTUtils.getTokenFromCookie(req) ?? {}

        if (accessToken && refreshToken) {
            const atoken = JWTUtils.verifyAccessToken(accessToken);
            const rtoken = JWTUtils.verifyRefreshToken(refreshToken);

            // if no token was verified or decoded, or refresh token is expired, have user reauth
            if (!atoken || !rtoken || !atoken.userId || !atoken.jwtHash || !rtoken.jwtHash || rtoken.isExpired) {
                return haveUserReAuth(res);
            }

            // verify token has valid credentials if it is expired, then refresh tokens if valid
            if (atoken.isExpired) {
                return verifyTokenHash(atoken, rtoken, req, res, next);
            }

            const userId = MongooseUtils.idStringToMongooseId(atoken.userId);

            if (!userId) {
                return haveUserReAuth(res);
            }

            res.locals.user = { id: userId }
            
            return next();
        } else {
            // if no token was sent in the request, have user reauth
            return haveUserReAuth(res);
        }
    } catch(err) {
        haveUserReAuth(res);
    }
}

/* send error to client to have user re-auth */
export const haveUserReAuth = (res: Response) => ControllerUtils.respondWithErr(BaseRequestErrors.UserMustReAuth({}), res)

/* validate access token and refresh access and refresh tokens if valid */
const verifyTokenHash = (aToken: IVerifiedTokenResponse, rToken: IVerifiedTokenResponse, req: Request, res: Response, next: NextFunction) => {
    const id = MongooseUtils.idStringToMongooseId(aToken?.userId);

    if (!id) {
        return haveUserReAuth(res);
    }

    db.User.findById(id, (err: any, user: UserModel.Document) => {
        if (err || !user) {
            return haveUserReAuth(res);
        }

        // hash stored on jwt
        const userJWTHash = rToken?.jwtHash
        // check if hash exists on jwt hash object in db
        const isValidHash = !!(userJWTHash && user?.jwtHash[userJWTHash]);

        // if hash from jwt is valid and refresh token is not expired, refresh tokens
        if (isValidHash && !rToken?.isExpired) {
            return refreshTokens(req, res, id, userJWTHash, next);
        } else {
            return haveUserReAuth(res);
        }
    })
}

/* generate new jwt's and void current refresh token */
const refreshTokens = async (req: Request, res: Response, userId: TObjectId, oldHash: string, next: NextFunction) => {
    const tokenHash = await generateRandomHash();

    // find user and update jwt hash for user's document
    db.User.findOne({ _id: userId }, async (err: NativeError, user: UserModel.Document) => {
        if (err || !user) {
            return haveUserReAuth(res);
        }

        const newHashObj = {...(user.jwtHash ?? {})};

        try {
            // try removing old hash key/value from jwt hash obj
            delete newHashObj[oldHash];
        } catch (err) {}

        // add new token to jwt hash obj
        newHashObj[tokenHash] = true;
        user.jwtHash = newHashObj;
        // update user instance in db
        user.save();

        createTokenCookies(user, tokenHash, res);

        res.locals.user = { id: userId }

        return next();
    })
}

export const createTokenCookies = (user: UserModel.Document, hash: string, res: Response) => {
    const accessToken = user.generateAccessToken(hash);
    const refreshToken = user.generateRefreshToken(hash);

    const tokens = {
        accessToken, refreshToken
    }

    // create cookie for tokens with no expiration to keep user always signed in until they clear their cookies
    res.cookie("siteTokens", JSON.stringify(tokens), {
        // forces use of https in production
        secure: !EnvUtils.isLocal,
        // makes tokens inaccessible in client's javascript
        httpOnly: true,
    })

    return tokens;
}

const SECRET = EnvUtils.getEnvVar(ServerEnvVars.SECRET, "");

// generates random rash with no periods to avoid issues accessing values within objects later
export const generateRandomHash = async () => {
    return (await bcrypt.hash(SECRET, 10)).replace(/\./g, "");
}