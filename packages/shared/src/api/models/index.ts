import mongoose, {} from "mongoose";

export type TObjectId = mongoose.Types.ObjectId;

/* properties that will exist on every model */
export type BaseModelDocProps = {
    _id: TObjectId;
    id: string;
    createdAt: string;
    updatedAt: string;
}

/* utility type to remove unneccessary fields from doc type before being sent to client */
export type ResponseJSON<T = {}> = Omit<T, "_id"> & {
}

/* utility type to create appropriately typed mongoose document */
export type TDocument<TDoc, TQueryHelpers, TInstanceMethods> = mongoose.Document<TObjectId, TQueryHelpers, TDoc> & TDoc & TInstanceMethods;
/* utility type to create appropriately typed mongoose model */
export type TModel<TDoc, TQueryHelpers, TInstanceMethods> = mongoose.Model<TDoc, TQueryHelpers, TInstanceMethods>;

/* Utility type to get the type of a ref field on a db document given whether the field has been populated or not */
export type ModelRefFieldType<Fields extends {}, Field extends keyof Fields> = unknown extends Fields[Field] ? TObjectId : Fields[Field];

/* Utility type to ensure that ref fields types is a partial */
export type ModelRefFields<FieldTypes extends {}> = Partial<FieldTypes>;

/* returns one of two types based on whether the type param provided is an object id or a populated doc */
export type PopulatedConditionalType<T, ObjectIdPositive, ObjectIdNegative> = T extends TObjectId ? ObjectIdPositive : ObjectIdNegative;

export * from "./User.model";