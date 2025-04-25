import { model, Schema } from "mongoose";
import { handleSaveError, setUpdateSettings } from "./hooks.js";

const usersSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

usersSchema.post('save', handleSaveError);

usersSchema.pre('findOneAndUpdate', setUpdateSettings);

usersSchema.post('findOneAndUpdate', handleSaveError);

const UserCollection = model("user", usersSchema);

export default UserCollection;
