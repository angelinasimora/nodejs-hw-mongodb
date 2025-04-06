import { ContactCollection } from "../db/contacts/Contact.js";

export const getContacts = () => ContactCollection.find();

export  const getContactById = (id) => ContactCollection.findById(id);
