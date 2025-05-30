import express from "express";
import { Request, Response } from "express";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
