// backend/models/product.model.js
// Modelo de producto para módulo de productos (nombre, descripcion, precio, stock, creadoPor)

import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ProductSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre del producto es obligatorio"], trim: true },
    descripcion: { type: String, required: [true, "La descripción es obligatoria"], trim: true },
    precio: { type: Number, required: [true, "El precio es obligatorio"], min: 0 },
    stock: { type: Number, required: [true, "El stock es obligatorio"], min: 0, default: 0 },
    creadoPor: { type: Types.ObjectId, ref: "User", required: false }, // opcional si lo crea el admin/usuario
    creadoEn: { type: Date, default: Date.now },
    actualizadoEn: { type: Date, default: Date.now }
}, {
    collection: "products",
    versionKey: false
});

// middleware pre-save para actualizar timestamps
ProductSchema.pre("save", function (next) {
    this.actualizadoEn = Date.now();
    next();
});

export default model("Product", ProductSchema);