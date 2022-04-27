import { BaseRequestErrors } from "@chess-game/shared/src/api/requests";
import { ServerErrorStatusCodes } from "@chess-game/shared/src/api/requests/StatusCodes";
import type { Response } from "express";

// used to verify the response object properties for a given status code
export type ValidErrRes<T extends { status: number; error: string; }> = T;

export class ControllerUtils {
    public static setResponseHeader(header: ValidHeaders, value: string, res: Response) {
        return res.setHeader(header, value);
    }

    /* responds to express http request with an appropriate data response for the given error code */
    public static respondWithErr(errObj: { status: number; error: string; }, res: Response) {
        const { status, ...rest } = errObj;

        try {
            res.status(status).json(rest).end();
        } catch (err) {
            res.status(ServerErrorStatusCodes.InternalServerError).end();
        }
    }

    /* responsed to http request with 500 error for an unexpected server error */
    public static respondWithUnexpectedErr(res: Response, errMsg?: string) {
        console.error(errMsg);
        ControllerUtils.respondWithErr(BaseRequestErrors.UnexpectedCondition(errMsg ? { errMsg } : undefined), res);
    }

    /* try-catch wrapper for controllers to catch any unplanned errors */
    public static async controllerWrapper(res: Response, controller: () => Promise<any>) {
        try {
            await controller();
        } catch(err) {
            ControllerUtils.respondWithUnexpectedErr(res);
        }
    }
}

type ValidHeaders = 
    "authorization"