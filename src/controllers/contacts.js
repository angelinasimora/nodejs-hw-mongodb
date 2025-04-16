import { getAllContacts, getContactById, addContact, updateContact, deleteContactById } from "../services/contacts.js";

import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";

import createHttpError from 'http-errors';
export const getContactsController = async (req, res) => {

  const {page, perPage} = parsePaginationParams(req.query);
const { sortOrder, sortBy} =  parseSortParams(req.query);

  const data = await getAllContacts({
    page,
    perPage,
    sortOrder,
    sortBy
  });

    res.json({
        status: 200,
        message: "Contacts fetched successfully", data,
    });
};

export const getContactByIdController = async (req, res) => {
        const { id } = req.params;

        const data = await getContactById(id);
        if (!data) {

            throw createHttpError(404, `Contact with id=${id} not found`);
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id=${id}`, data,
        });

};

export const addContactController = async (req, res) => {
    const data = await addContact(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data,
});

};

// export const upsertContactController = async (req, res) => {
//   const { id } = req.params;
//   const { data, isNew } = await updateContact(id, req.body, { upsert: true });

//   const status = isNew ? 201 : 200;


//   if (!data) {
//     throw createHttpError(404, `Contact with id=${id} not found`);
//   }

//   res.status(status).json({
//     status,
//     message: "Successfully updated contact",
//     data,
//   });
// };

export const patchContactController = async(req, res)=> {
  const {id} = req.params;
  const result = await updateContact(id, req.body);

  if (!result) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

export const deleteContactController = async(req, res)=> {
  const {id} = req.params;
  const data = await deleteContactById(id);

  if (!data) {
    throw createHttpError(404, `Contact with id=${id} not found`);
  }

  res.status(204).send();
};
