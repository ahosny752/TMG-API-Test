import express, { Application } from "express";
import stackRoutes from "./routes/stackManager";
import storeRoutes from "./routes/storeManager";
import errorMiddleware from "./utils/errorMiddleware";
import cors from "cors";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use("/stackManager", stackRoutes);
app.use("/storeManager", storeRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5001;

//this is so server doesnt start multiple instances when running tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
