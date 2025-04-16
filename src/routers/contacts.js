
import {Router} from "express";

const contactsRouter = Router();

import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    getContactsController, getContactByIdController, addContactController,
  // upsertContactController,
    patchContactController,
    deleteContactController
} from "../controllers/contacts.js";

import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../utils/validateBody.js";
import {contactAddSchema, contactUpdateSchema} from "../validation/contacts.js";

contactsRouter.get("/",ctrlWrapper(getContactsController));

contactsRouter.get("/:id",isValidId, ctrlWrapper(getContactByIdController));

contactsRouter.post("/",validateBody(contactAddSchema),ctrlWrapper(addContactController));

// contactsRouter.put('/:id', ctrlWrapper(upsertContactController));


contactsRouter.patch("/:id", isValidId,validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default contactsRouter;
