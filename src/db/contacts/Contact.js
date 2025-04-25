import { Schema, model } from "mongoose";

import { typeList, } from "../../constants/contacts.js";

import { handleSaveError, setUpdateSettings } from "./hooks.js";



const contactSchema = new Schema({
    name: {
        type: String,
        required:[true, "Ім'я обов'язкове"],
    },

    phoneNumber: {
        type: String,
        required:true
    },

    email: {
        type: String

    },

    isFavourite: {
        type: Boolean,
        default:false
    },

    contactType: {
        type: String,
        required: true,
        enum: typeList,
        default:"personal"
    },

    userId: {
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'users'
    },
}, {versionKey:false, timestamps:true});


contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);

export const ContactCollection = model("contact", contactSchema);


const usersSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const UsersCollection = model('users', usersSchema);

