import Joi from "joi";

import { typeList } from "../constants/contacts.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().min(3).max(20).messages({
        "any.required": "Треба написати ім'я",
        "string.base": "Напиши ім'я", }),
    phoneNumber: Joi.string().required(),
    email: Joi.string().email().min(3).max(20),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList).default("personal").required()
});


export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid(...typeList).default("personal")
});
