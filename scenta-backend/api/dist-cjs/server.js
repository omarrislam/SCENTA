"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const start = async () => {
    await (0, db_1.connectDatabase)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.PORT, () => {
        console.log(`SCENTA API running on ${env_1.env.PORT}`);
    });
};
start();
