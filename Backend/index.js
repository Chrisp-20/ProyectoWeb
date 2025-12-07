const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const ruletaRoutes = require("./routes/ruleta.routes.js");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(
  "mongodb+srv://userweb:Us3rweb_@cluster00.zfjs1ub.mongodb.net/?appName=Cluster00"
)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));


app.engine("handlebars", exphbs.engine({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../Frontend/Layouts")
}));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../Frontend"));


app.use(express.static(path.join(__dirname, "../Public")));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);


const pages = [
  "inicio", "login", "registro", "perfil", "ruleta",
  "deposito", "retiro", "info", "info_ruleta", "recuperarc"
];

pages.forEach(page => {
  app.get(`/${page}`, (req, res) => res.render(page.charAt(0).toUpperCase() + page.slice(1)));
});


app.get("/", (req, res) => res.redirect("/inicio"));


app.use((req, res) => {
  res.status(404).render("404", { mensaje: "Página no encontrada" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend API corriendo en el puerto ${PORT}`);
});
