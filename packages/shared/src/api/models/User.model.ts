import mongoose, {} from "mongoose";
import { BaseModelDocProps, ModelRefFields, ModelRefFieldType, PopulatedConditionalType, ResponseJSON, TDocument, TModel, TObjectId } from ".";

type WithoutSensitiveData<T = {}> = Omit<T, "password" | "jwtHash">;

type UserRefFieldTypes = ModelRefFields<{
    // TUserActivities: TObjectId | ActivityModel.Document | ActivityModel.FullResponseJSON;
}>

export namespace UserModel {

    export type User<RefFields extends UserRefFieldTypes = {}> = BaseModelDocProps & {
        email: string;
        password: string;
        fullName: string;
        username: string;
        profileImg: string;
        /* random hash used to enforce refresh jwt's only being used once */
        jwtHash: { [key: string]: boolean; };
        /* activities created by the user */
        // userActivities: ModelRefFieldType<RefFields, "TUserActivities">[];
    }

    export type Document<RefFields extends UserRefFieldTypes = {}> = TDocument<User<RefFields>, QueryHelpers, InstanceMethods<RefFields>>;
    
    export type Model<RefFields extends UserRefFieldTypes = {}> = TModel<Document<RefFields>, QueryHelpers, InstanceMethods<RefFields>>

    /* User model when only both activity fields have been populated */
    // export type AllActivitiesPopulatedDoc = Document<{ TUserActivities: ActivityModel.Document; TSavedActivities: ActivityModel.Document; }>;
    /* User model when only 'lists' field have been populated */

    export type InstanceMethods<RefFields extends UserRefFieldTypes = {}> = {
        toFullUserJSON: () => Promise<FullResponseJSON<RefFields>>;
        validatePassword: (password: string) => Promise<boolean>;
        generateAccessToken: (hash: string) => string | undefined;
        generateRefreshToken: (hash: string) => string | undefined;
        /* returns JSON object with basic user data */
        toShallowUserJSON: () => Promise<ShallowResponseJSON>;
    }

    export type QueryHelpers = {
    }

    /* different response types for final JSON objects sent to client */
    export type FullResponseJSON<RefFields extends UserRefFieldTypes = {}> = ResponseJSON<WithoutSensitiveData<User<RefFields>>>
    export type ShallowResponseJSON<RefFields extends UserRefFieldTypes = {}> = ResponseJSON<WithoutSensitiveData<Pick<User<RefFields>, "createdAt" | "email" | "fullName" | "id" | "profileImg" | "username" | "createdAt" | "updatedAt">>>
    // export type AllPopulatedFullResponseJSON = FullResponseJSON<{ TUserActivities: ActivityModel.FullResponseJSON; TSavedActivities: ActivityModel.FullResponseJSON; TLists: ListModel.FullResponseJSON }>
}