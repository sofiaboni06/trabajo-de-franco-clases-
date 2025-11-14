import mongoose from "mongoose";

// defino la receta (schema o estructura de los datos)
const userSchema = new mongoose.Schema({
    nombre : { type: String, required: true, trim: true },
    email : { type: String, required: true, trim: true, unique: true, lowercase: true },
    password : { type: String, required: true },
    edad : { type: Number, default: null }
}, { timestamps: true }); // timestamps => agrega createdAt y updatedAt automáticamente

// Creamos el modelo
const User = mongoose.model("User", userSchema);

export default User;
