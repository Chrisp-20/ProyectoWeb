const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const ruletaRoutes = require("./routes/ruleta.routes.js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://userweb:Us3rweb_@cluster00.zfjs1ub.mongodb.net/?appName=Cluster00")
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));

app.engine("handlebars", exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../Frontend/layouts")
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../Frontend"));

app.use(express.static(path.join(__dirname, "../Public")));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);

app.get("/", (req, res) => res.render("Inicio"));
app.get("/login", (req, res) => res.render("Login"));
app.get("/registro", (req, res) => res.render("Registro"));
app.get("/perfil", (req, res) => res.render("Perfil"));
app.get("/ruleta", (req, res) => res.render("Ruleta"));
app.get("/deposito", (req, res) => res.render("Deposito"));
app.get("/retiro", (req, res) => res.render("Retiro"));
app.get("/info", (req, res) => res.render("Info"));
app.get("/info_ruleta", (req, res) => res.render("Info_ruleta"));
app.get("/recuperarc", (req, res) => res.render("Recuperarc"));

app.use((req, res) => {
  res.status(404).render("404", { mensaje: "Página no encontrada" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API corriendo en el puerto ${PORT}`);
});
