import express from "express";
import { config } from "dotenv";
import authRouter from "./routes/authRoutes";
import connectToDb from "./db/connectToDb";
config();

const app = express();

connectToDb().then(() => {
  console.log("Connected to MongoDB");
}
).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

app.use(express.json());
app.use("/api/v1/auth",authRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});