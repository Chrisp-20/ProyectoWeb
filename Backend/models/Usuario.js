const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    correo: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Correo electrónico inválido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
      select: false, // No devolver password por defecto en queries
    },
    saldo: {
      type: Number,
      default: 0,
      min: [0, "El saldo no puede ser negativo"],
    },
    historial: [
      {
        tipo: {
          type: String,
          enum: ["deposito", "retiro", "apuesta", "ganancia"],
        },
        monto: Number,
        descripcion: String,
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Middleware para encriptar password antes de guardar
UsuarioSchema.pre("save", async function (next) {
  // Solo encriptar si el password fue modificado
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar passwords
UsuarioSchema.methods.compararPassword = async function (passwordIngresado) {
  return await bcrypt.compare(passwordIngresado, this.password);
};

// Método para agregar al historial
UsuarioSchema.methods.agregarHistorial = function (tipo, monto, descripcion) {
  this.historial.push({
    tipo,
    monto,
    descripcion,
    fecha: new Date(),
  });
};

module.exports = mongoose.model("Usuario", UsuarioSchema);