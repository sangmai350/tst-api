import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import "reflect-metadata";
import { createConnection } from "typeorm";
import routes from "./routes";
const serverPort = process.env.YOUR_PORT || process.env.PORT || 3000;

// Connects to the Database -> then starts the express
createConnection()
  .then(async (connection) => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    // Set all routes from routes folder
    app.use("/", routes);

    app.listen(serverPort, () => {
      console.log(`Server started on port ${serverPort}`);
    });
  })
  .catch((error) => console.log(error));
