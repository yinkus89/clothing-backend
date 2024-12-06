"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const app_1 = require("./app"); // Import app and port from app.ts
// Start the server
app_1.app.listen(app_1.port, () => {
    console.log(`Server is running on port ${app_1.port}`);
});
