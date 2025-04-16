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
