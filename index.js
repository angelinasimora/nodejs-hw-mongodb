import { initMongoConnection } from "./src/db/initMongoConnection.js";

import { setupServer } from "./src/server.js";


const startApp = async () => {
await initMongoConnection();
setupServer();


};
export const SORT_ORDER = {
ASC: 'asc',
DESC: 'desc',
}
startApp();

// export const FIFTEEN_MINUTES = 15 * 60 * 1000;
// export const ONE_DAY = 24 * 60 * 60 * 1000;
