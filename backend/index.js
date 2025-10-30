import express from "express";
import dotenv from "dotenv";
import chatRoute from "./routes/chatRoute.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({
   origin: process.env.FRONTEND_URL,
   credential: true
}));

app.use("/api", chatRoute);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port: ${process.env.PORT}`);
});