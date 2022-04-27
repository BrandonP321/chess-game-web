import { UserModel } from "@chess-game/shared/src/api/models/User.model";
import { RegisterUserErrors, RegisterUserRequest } from "@chess-game/shared/src/api/requests/auth";
import bcrypt from "bcrypt";
import { ValidErrRes } from "~Utils/ControllerUtils";
import { JWTUtils } from "~Utils/JWTUtils";
import mongoose from "mongoose";
import { DocUtils } from "~Utils/DocUtils";

/**
 * INSTANCE METHODS
 */

const validatePassword: UserModel.InstanceMethods["validatePassword"] = async function(this: UserModel.Document, pass: string) {
    return bcrypt.compare(pass, this.password);
}

const generateAccessToken: UserModel.InstanceMethods["generateAccessToken"] = function(this: UserModel.Document, hash: string) {
    const token = JWTUtils.signAccessToken(this._id.toString(), hash);

    return token;
}

const generateRefreshToken: UserModel.InstanceMethods["generateRefreshToken"] = function(this: UserModel.Document, hash) {
    const token = JWTUtils.signRefreshToken(this._id.toString(), hash);

    return token;
}

/* converts user response to a shallow response with only basic user info */
const toShallowUserJSON: UserModel.InstanceMethods["toShallowUserJSON"] = async function(this: UserModel.Document) {
    return {
        id: this._id.toString(),
        email: this.email,
        username: this.username,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
        profileImg: this.profileImg,
        fullName: this.fullName
    }
}

const toFullUserJSON: UserModel.InstanceMethods["toFullUserJSON"] = async function(this: UserModel.Document) {
    const userJSON: UserModel.FullResponseJSON = {
        id: this.id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
        profileImg: this.profileImg,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,    
    }

    return userJSON;
}

export type IUserDocSaveErr = ValidErrRes<RegisterUserRequest.ErrResponse["response"]["data"]> | undefined

export const handleUserDocSaveErr = async function(err: { code?: number; [key: string]: any } & Error, doc: UserModel.Document, next: (err: any) => void) {
    let errObj: IUserDocSaveErr = undefined;

    if (err.code && err.code === 11000 && err.keyValue) {
        // error code 11000 indicates a duplicate of a unique key
        const errField = Object.keys(err.keyValue)[0]
        if (errField === "email" || errField === "username") {
            const errMsg = `An account with this ${errField} already exists.`;
            errObj = RegisterUserErrors.Errors.EmailOrUsernameTaken({ credTaken: errField, errorMsg: errMsg })
        } else {
            errObj = RegisterUserErrors.Errors.UnexpectedCondition();
        }
    } else if (err instanceof mongoose.Error.ValidationError) {
        // validation of a property failed and we know it's not due to a duplicate key
        for (const errKey in err.errors) {
            const error = err.errors[errKey];

            if (error instanceof mongoose.Error.ValidatorError) {
                switch (error.kind) {
                    case "required":
                    case "regexp":
                        if (errKey === "username" || errKey === "email") {
                            errObj = RegisterUserErrors.Errors.InvalidUserInput({ field: errKey, errMsg: `Please provide a valid ${errKey}.` });
                            break;
                        }
                }

                // break out of for loop if error has been found
                if (errObj) {
                    break;
                }
            } else if (error instanceof mongoose.Error.ValidationError) {
                console.log("Validation Error")
            } else if (error instanceof mongoose.Error.CastError) {
                console.log("Case Error")
            }
        }
    }

    if (!errObj) {
        errObj = RegisterUserErrors.Errors.UnexpectedCondition();
    }

    next(errObj)
}

export const userMethods: Required<UserModel.InstanceMethods> = {
    validatePassword,
    generateAccessToken,
    generateRefreshToken,
    toShallowUserJSON,
    toFullUserJSON,
}