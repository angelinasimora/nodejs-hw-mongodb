import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routers/index.js';

import { getEnvVar } from './utils/getEnvVar.js';
import { UPLOAD_FILE_DIR } from './constants/index.js';


export const setupServer = () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(logger);

    app.use('/auth/upload', express.static(UPLOAD_FILE_DIR));

    app.use(router);

    app.use(notFoundHandler);

    app.use(errorHandler);



    const port = Number(getEnvVar("PORT", 3000));
    app.listen(port, () => console.log(`Server running on ${port} port`));

};

export const startServer = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(cookieParser());
};
