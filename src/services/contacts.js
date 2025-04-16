import { ContactCollection } from "../db/contacts/Contact.js";

import { calculatePaginationData } from "../utils/calculatePaginationData.js";

import { SORT_ORDER } from "../../index.js";

export const getContacts = () => ContactCollection.find();

export const getContactById = id => ContactCollection.findOne({_id: id});

export const addContact = payload => ContactCollection.create(payload);


export const updateContact = async(_id, payload, options = {})=> {
    const {upsert} = options;
    const rawResult = await ContactCollection.findOneAndUpdate({_id}, payload, {
        upsert,
        includeResultMetadata: true,
    });

    if(!rawResult || !rawResult.value) return null;

    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted)
    };
};

export const deleteContactById = _id => ContactCollection.findOneAndDelete({_id});

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortOrder = SORT_ORDER.ASC,
    sortBy = '_id',
}) => {
const limit = perPage;
const skip = (page - 1) * perPage;

const contactsQuery = ContactCollection.find();
const contactsCount = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

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
