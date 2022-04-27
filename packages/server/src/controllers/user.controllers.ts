import db from "~Models";
import { RouteController } from "~Controllers";
import { IAuthJWTResLocals } from "~Middleware/authJWT.middleware";
import { NativeError } from "mongoose";
import { UserModel } from "@chess-game/shared/src/api/models/User.model";
import { ControllerUtils } from "~Utils/ControllerUtils";
import { GetUserErrors, GetUserRequest } from "@chess-game/shared/src/api/requests/user";
import { FoundDoc } from "~Utils/MongooseUtils";

const { respondWithErr, respondWithUnexpectedErr, controllerWrapper } = ControllerUtils;

export const GetUserController: RouteController<GetUserRequest.Request, {}> = async (req, res) => {
    controllerWrapper(res, async () => {
        db.User.findById(req.params.id, async (err: NativeError, user: FoundDoc<UserModel.Document>) => {
            if (err) {
                return respondWithUnexpectedErr(res, "Error finding user");
            } else if (!user) {
                return respondWithErr(GetUserErrors.Errors.UserNotFound(), res);
            }
    
            try {
                const userJSON = await user.toFullUserJSON();
    
                return res.json(userJSON).end();
            } catch(err) {
                return respondWithUnexpectedErr(res, "Error converting user doc to JSON object");
            }
        })
    })
}