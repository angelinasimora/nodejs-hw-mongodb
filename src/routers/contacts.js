import {Router} from "express";

import { ctrlWrapper } from "../utils/ctrlWrapper.js";

import { upload } from "../middlewares/multer.js";

import {
  getContactsController, getContactByIdController, addContactController,
  patchContactController,
  deleteContactController
} from "../controllers/contacts.js";

import { isValidId } from "../middlewares/isValidId.js";
import { validateBody } from "../utils/validateBody.js";
import {contactAddSchema, contactUpdateSchema} from "../validation/contacts.js";
import {authenticate} from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/",ctrlWrapper(getContactsController));

router.get("/:id",isValidId, ctrlWrapper(getContactByIdController));

// router.post("/",
//   upload.single('photo'),
//   validateBody(contactAddSchema), ctrlWrapper(addContactController));

// router.patch(
//   '/:id',
//   isValidId,
//   upload.single('photo'),
//   validateBody(contactUpdateSchema),
//   ctrlWrapper(patchContactController),
// );
router.post("/",validateBody(contactAddSchema),ctrlWrapper(addContactController));

router.patch("/:id",
  isValidId, upload.single ('photo'), validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));


router.delete("/:id", isValidId, ctrlWrapper(deleteContactController));

export default router;
