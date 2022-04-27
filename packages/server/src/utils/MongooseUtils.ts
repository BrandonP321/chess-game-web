import mongoose, { Schema } from "mongoose";
import { TObjectId } from "@chess-game/shared/src/api/models";

export type FoundDoc<Doc extends {}> = null | Doc;

export type PopulatedDoc<PopulatedType> = PopulatedType | TObjectId;

export type DBUpdateDoc = {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: null;
    upsertedCount: number;
    matchedCount: number;
}

export class MongooseUtils {
    public static mongooseIdToString(id: TObjectId) {
        try {
            return id.toString();
        } catch (err) {
            return undefined;
        }
    }

    public static idStringToMongooseId(id: string | undefined): TObjectId | undefined {
        if (!id) {
            return undefined;
        }

        try {
            return new mongoose.Types.ObjectId(id);
        } catch (err) {
            return undefined;
        }
    }
}