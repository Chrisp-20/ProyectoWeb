require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const exphbs = require("express-handlebars");

const authRoutes = require("./routes/auth.routes.js");
const userRoutes = require("./routes/user.routes.js");
const ruletaRoutes = require("./routes/ruleta.routes.js");

const app = express();

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch(err => console.log("Error Mongo:", err));

// Handlebars
app.engine(
  "handlebars",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "../Frontend/Layouts"),
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "../Frontend"));

// Archivos estáticos
app.use(express.static(path.join(__dirname, "../Public")));

// Rutas API REST
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/ruleta", ruletaRoutes);

// Rutas del frontend (vistas públicas y privadas)
app.get("/", (req, res) => res.redirect("/Inicio"));
app.get("/Inicio", (req, res) => res.render("Inicio"));
app.get("/Login", (req, res) => res.render("Login"));
app.get("/Registro", (req, res) => res.render("Registro"));
app.get("/Perfil", (req, res) => res.render("Perfil"));
app.get("/Ruleta", (req, res) => res.render("Ruleta"));
app.get("/Deposito", (req, res) => res.render("Deposito"));
app.get("/Retiro", (req, res) => res.render("Retiro"));
app.get("/Info", (req, res) => res.render("Info"));
app.get("/Info_ruleta", (req, res) => res.render("Info_ruleta"));
app.get("/Recuperarc", (req, res) => res.render("Recuperarc"));

// Ruta de logout (redirige al frontend para limpiar token)
app.get("/logout", (req, res) => {
  res.send(`
    <script>
      localStorage.removeItem('token');
      window.location.href = '/Inicio';
    </script>
  `);
});

// 404
app.use((req, res) => {
  res.status(404).render("404", { mensaje: "Página no encontrada" });
});

// Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Backend API corriendo en el puerto ${PORT}`);
});