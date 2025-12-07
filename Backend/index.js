import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import ruletaRoutes from "./routes/ruleta.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb+srv://userweb:Us3rweb_@cluster00.zfjs1ub.mongodb.net/?appName=Cluster00")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);


app.listen(3000, () => {
  console.log("Backend API corriendo en el puerto 3000");
});
