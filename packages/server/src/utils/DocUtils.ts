import mongoose, { NativeError } from "mongoose";

export class DocUtils {
    public static populateField = async function<TPopulatedDoc extends unknown>(doc: mongoose.Document, field: string | string[]) {
        try {
            const populatedDoc: TPopulatedDoc = await doc.populate(field);
    
            return populatedDoc ?? undefined;
        } catch (err) {
            return undefined;
        }
    }
}

export type SingleFoundDoc<DocType> = null | DocType;
export type ManyFoundDoc<DocType> = DocType[];
export type FindDocErr<Err = {}> = Err | NativeError;