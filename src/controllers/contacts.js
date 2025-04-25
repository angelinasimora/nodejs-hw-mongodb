import { getAllContacts, getContactById, addContact,updateContact, deleteContactById } from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
   const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query);

 const filters = { userId: req.user._id };

  const data = await getAllContacts({...paginationParams, ...sortParams, filters});

  res.json({
    status: 200,
    message: "Contacts fetched successfully",
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const data = await getContactById(id, userId);
  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id=${id}`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const {_id: userId} = req.user;
  const data = await addContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: "Successfully created a contact!",
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const result = await updateContact(id,userId, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const data = await deleteContactById(id, userId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};
