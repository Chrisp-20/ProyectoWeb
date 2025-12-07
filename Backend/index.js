import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import ruletaRoutes from "./routes/ruleta.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a Mongo
mongoose.connect("mongodb+srv://userweb:Us3rweb_@cluster00.zfjs1ub.mongodb.net/?appName=Cluster00")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);

// Sin Handlebars, sin res.render
// Express SOLO es backend API REST

app.listen(3000, () => {
  console.log("Backend API corriendo en el puerto 3000");
});
