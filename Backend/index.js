const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const ruletaRoutes = require("./routes/ruleta.routes.js");

const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://userweb:Us3rweb_@cluster00.zfjs1ub.mongodb.net/?appName=Cluster00")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);


app.use(express.static(path.join(__dirname, "../public"))); 


app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html")); 
});

app.listen(3000, () => {
  console.log("Backend API corriendo en el puerto 3000");
});
