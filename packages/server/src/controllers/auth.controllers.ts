import { ControllerUtils } from "~Utils/ControllerUtils";
import { LoginUserErrors, LoginUserRequest, RegisterUserErrors, RegisterUserRequest } from "@chess-game/shared/src/api/requests/auth";
import db from "~Models"
import mongoose, { CallbackError, NativeError } from "mongoose";
import { UserModel } from "@chess-game/shared/src/api/models/User.model";
import { RouteController } from "./index";
import bcrypt from "bcrypt";
import { EnvUtils, ServerEnvVars } from "@chess-game/shared/src/utils/EnvUtils";
import { AuthUtils } from "@chess-game/shared/src/utils/AuthUtils";
import { IUserDocSaveErr } from "~Models/User/userMethods";
import { ConfigUtils } from "@chess-game/shared/src/utils/ConfigUtils"
import { MasterConfig } from "@chess-game/shared/src/config"
import { Response } from "express"
import { createTokenCookies, generateRandomHash } from "~Middleware/authJWT.middleware";

const { controllerWrapper, respondWithErr, respondWithUnexpectedErr } = ControllerUtils;


export const RegisterUserController: RouteController<RegisterUserRequest.Request, {}> = async (req, res) => {
    controllerWrapper(res, async () => {
        const { email, fullName, password, passwordReEnter, phone, username } = req.body;
    
        // validate input from user
        const inputErr = AuthUtils.validateRegistrationFields({ email, fullName, password, passwordReEnter, phone, username })
    
        if (inputErr) {
            return respondWithErr(RegisterUserErrors.Errors.InvalidUserInput({ errMsg: inputErr.msg, field: inputErr.field }), res)
        }
    
        // hash that will be used to enforce that a refresh token is only used once
        const newTokenHash = await generateRandomHash();
    
        const user: Partial<UserModel.User> = {
            ...req.body,
            jwtHash: { [newTokenHash]: true }
        }
    
        db.User.create(user, async (err: CallbackError | IUserDocSaveErr, user) => {
            if (err && !(err instanceof global.Error)) {
                return respondWithErr(err, res)
            } else if (err) {
                return respondWithUnexpectedErr(res);
            }
    
            try {
                createTokenCookies(user, newTokenHash, res);
            } catch (err) {
                return respondWithUnexpectedErr(res);
            }
    
            const userJSON = await user.toShallowUserJSON()
    
            res.json(userJSON).end();
        })
    })
}

export const LoginUserController: RouteController<LoginUserRequest.Request, {}> = async (req, res) => {
    controllerWrapper(res, async () => {
        const { email, password } = req.body;
    
        const inputErr = AuthUtils.validateLoginFields({ email, password });
    
        if (inputErr) {
            return respondWithErr(LoginUserErrors.Errors.MissingUserInput({ errorMsg: inputErr.msg, field: inputErr.field }), res);
        }
    
        // hash that will be used to enforce that a refresh token is only used once
        const newTokenHash = await generateRandomHash();

    
        db.User.findOne({ email }, async (err: NativeError, user: UserModel.Document | null) => {
            if (err) {
                console.log(err);
                // status 500 if any error occurred while finding the user's collection, not including if it wasn't found
                return respondWithUnexpectedErr(res);
            } else if (!user) {
                return respondWithErr(LoginUserErrors.Errors.IncorrectEmailOrPassword({}), res)
            }
    
            const isPasswordValid = await user.validatePassword(password);
    
            if (!isPasswordValid) {
                return respondWithErr(LoginUserErrors.Errors.IncorrectEmailOrPassword({}), res);
            }

            const newHashObj = {
                ...(user.jwtHash ?? {}),
                [newTokenHash]: true,
            }
    
            try {
                createTokenCookies(user, newTokenHash, res);
                user.jwtHash = newHashObj;
                user.save();
            } catch (err) {
                console.log(err);
                return respondWithUnexpectedErr(res);
            }
    
            const userJSON = await user.toShallowUserJSON();
    
            return res.json({
                ...userJSON
            }).send().end();
        })
    })
}