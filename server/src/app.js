import express, { json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
//Security packages
import helmet from "helmet";
import { connectDB } from "./db/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import router from "./routes/index.js";
import fileUpload from "express-fileupload";

const __dirname = path.resolve(path.dirname(""));

//Connect to MongoDB
await connectDB();

const app = express();

//Middlewares
app.use("/users", express.static(path.join(__dirname, "src", "views")));
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://cdn.tailwindcss.com",
        "https://kit.fontawesome.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdnjs.cloudflare.com",
        "https://cdn.jsdelivr.net",
        "https://ka-f.fontawesome.com",
      ],
      fontSrc: ["'self'", "https://ka-f.fontawesome.com"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'", "https://ka-f.fontawesome.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(json({ limit: "10mb" }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./upload",
  })
);
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
//Routes
app.use(router);

//Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Endpoint not found" });
});

//Error
app.use(errorHandler);

export default app;
