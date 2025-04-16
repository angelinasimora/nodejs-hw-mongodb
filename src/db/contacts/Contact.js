import { Schema, model } from "mongoose";

import { typeList, } from "../../constants/contacts.js";

import { handleSaveError,setUpdateSettings } from "./hooks.js";

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
    }
}, {versionKey:false, timestamps:true});


contactSchema.post("save", handleSaveError);
contactSchema.pre("findOneAndUpdate",setUpdateSettings );
contactSchema.post("findOneAndUpdate", handleSaveError);
export const ContactCollection = model("contact", contactSchema);
