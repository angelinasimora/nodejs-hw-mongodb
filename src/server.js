import express from 'express';
import cors from 'cors';
import pino from 'pino-http';

import { getEnvVar } from './utils/getEnvVar.js';

import { getContacts, getContactById } from './services/contacts.js';



export const setupServer = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(pino({
        transport: {
            target: 'pino-pretty',
        }
    }));


    app.get("/api/contacts", async (req, res) => {
        const data = await getContacts();
        res.json({
            status: 200,
            message: "Contacts fetched successfully", data,
        });
    });

    app.get("/api/contacts/:id", async (req, res) => {
        const { id } = req.params;

        const data = await getContactById(id);
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: `Movie with id=${id} not found`,
            });
}
        res.json({
            status: 200,
            message: `Successfully find movie with id=${id}`, data,
        });
    });

    app.use((req, res) => {
        res.status(404).json({
            message: `${req.url} not found`
        });
    });

    app.use((err, req, res, next) => {
        res.status(500).json({
            message: err.message,
        });
    });



    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => console.log(`Server running on ${port} port`));

};
