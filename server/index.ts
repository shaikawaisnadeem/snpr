import express from "express";
import router from "./routes/user.route.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/api`);
});
