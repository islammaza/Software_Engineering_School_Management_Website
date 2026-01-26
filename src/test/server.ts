import { setupServer } from "msw/node";

// Start with no handlers; individual tests can register via `server.use(...)`.
export const server = setupServer();
