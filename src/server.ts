import express from "express";
import { errorMiddleware } from "./middlewares/ErrorMiddleware";
import { router } from "./routes";

const app = express();
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
