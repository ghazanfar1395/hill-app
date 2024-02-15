import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import express, { Express, NextFunction, Request, Response } from "express";
import Knex from "knex";
import { Model } from "objection";
import session from "express-session";
import passport from "passport";
import { Passport } from "./middlewares/passport";

import { NotFoundError, ApiError, InternalError } from "./core/api-error";
import routes from "./core/route";

dotenv.config();

process.on("uncaughtException", (e) => {
  console.log("uncaughtException", e);
});

//Initialize knex.
const knex = Knex({
  client: "pg",
  connection: process.env.DB_URL,
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
});

// Bind all Models to a knex instance. If you only have one database in
// your server, this is all you have to do. For multi database systems, see
// the Model.bindKnex() method.
Model.knex(knex);

const app: Express = express();

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "healthy" });
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
// app.use(passport.initialize());
app.use(passport.session());
Passport();

const jsonParser = express.json();

app.use(jsonParser);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.static(`${__dirname}/public`));

app.use("/api", routes);

// catch 404 and forward to error handler
app.use((req, res, next) => next(new NotFoundError()));

// eslint-disable-next-line no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const error: any = err;
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else if (error.type === "UnprocessableEntityError") {
    ApiError.handle(error, res);
  } else {
    console.log("Error Response", err);
    ApiError.handle(new InternalError(), res);
  }
});

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  let test: any = reason;
  console.dir(test.stack);
  // application-specific logging, throwing an error, or other logic here
});

export default app;
