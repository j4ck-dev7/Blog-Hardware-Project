import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;

export const isValidObjectId = (id) => {
    return ObjectId.isValid(id);
}