import type { Request, Response } from "express";

/* Type of Express route controller function */
export type RouteController<T extends { UrlParams: {}; ReqBody: {}; ResBody: {} }, ResLocals>  = (
    req: Request<T["UrlParams"], T["ResBody"], T["ReqBody"], T["UrlParams"], {}>,
    res: Response<T["ResBody"], ResLocals>
) => Promise<any>

export interface DBUpdateResponse {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
}