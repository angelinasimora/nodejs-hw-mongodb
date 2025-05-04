import { ContactCollection } from "../db/contacts/Contact.js";

import { calculatePaginationData } from "../utils/calculatePaginationData.js";

import { SORT_ORDER } from "../../index.js";



export const getContacts = () => ContactCollection.find();

export const getContactById = (id, userId) => ContactCollection.findOne({_id: id, userId});


export const addContact = payload => ContactCollection.create(payload);


export const updateContact = async(_id, userId, payload, options = {})=> {
    const {upsert} = options;
    const rawResult = await ContactCollection.findOneAndUpdate({ _id, userId },
        payload,
        {
        upsert,
        includeResultMetadata: true,
        }
    );

    if(!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted)
    };
};

export const deleteContactById = (_id, userId) => ContactCollection.findOneAndDelete({_id,userId});

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filters = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find(filters);
  const contactsCount = await ContactCollection.find(filters).countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};
