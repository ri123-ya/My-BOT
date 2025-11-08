import express from "express";
import dotenv from "dotenv";
import chatRoute from "./routes/chatRoute.js";
import cors from "cors";

const app = express();
dotenv.config();

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  // credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"], 
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Header", "Content-Type");
  next();
});

app.use(express.json());
app.use("/api", chatRoute);

app.get("/", (req, res) => {
  res.send("server is running");
});


app.listen(process.env.PORT, () => {
  console.log(`🚀 Server is running on port: ${process.env.PORT}`);
});