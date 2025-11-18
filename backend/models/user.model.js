// backend/models/user.model.js
// Modelo de usuario: campos consistentes con los controladores y rutas
// Campos principales: nombre, email, password, role, creadoEn

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre es obligatorio"], trim: true },
    email: { type: String, required: [true, "El email es obligatorio"], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, "La contraseña es obligatoria"] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    creadoEn: { type: Date, default: Date.now }
}, {
    collection: "users",
    versionKey: false
});

// Para no devolver la contraseña cuando se serializa
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export default model("User", UserSchema);