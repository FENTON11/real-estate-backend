import express from "express";
import dotenv from "dotenv";
import cookieparser from "cookie-parser";
import cors from "cors";
import { router } from "./routes/userRoutes.js";
import { residencyRoute } from "./routes/residencyRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cookieparser());
app.use(cors());

// Define routes before starting the server
app.use("/api/user", router);
app.use("/api/residency", residencyRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
