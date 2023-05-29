import { createServer } from "http";
import app from "./app.js";
const port = process.env.PORT || 5000;

const server = createServer(app);
server.listen(port, () => {
  console.log("Server is running on port " + port);
});
