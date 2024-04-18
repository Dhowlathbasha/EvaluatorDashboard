import express from "express";
import bodyParser from "body-parser";
import mongoon from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import kpiRoutes from "./routes/kpi.js";
import KPI from "./models/KPI.js";
import { kpis } from "./data/data.js";


/* CONFIGURATIONS */
dotenv.config();

const app = express();

app.use(express.json());

app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(morgan("common"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

console.log("Server started ...");

/* ROUTES */
app.use("/kpi",kpiRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async ()=> {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

    // drop database to avoid duplicate data in the environment this is only for the development
    // In production remove the Drop database code from delow
    await mongoose.connection.db.dropDatabase(); 

    KPI.insertMany(kpis);
  })
  .catch((error) => console.log(`${error} did not connect to server`));
