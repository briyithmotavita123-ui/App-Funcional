// backend/models/service.model.js
// Modelo de servicio (nombre, descripcion, precio, duracion en minutos, proveedor)

import mongoose from "mongoose";

const { Schema, model, Types } = mongoose;

const ServiceSchema = new Schema({
    nombre: { type: String, required: [true, "El nombre del servicio es obligatorio"], trim: true },
    descripcion: { type: String, required: [true, "La descripción es obligatoria"], trim: true },
    precio: { type: Number, required: [true, "El precio es obligatorio"], min: 0 },
    duracion: { type: Number, required: [true, "La duración (minutos) es obligatoria"], min: 1 }, // en minutos
    proveedor: { type: String, required: false, trim: true },
    creadoPor: { type: Types.ObjectId, ref: "User", required: false },
    creadoEn: { type: Date, default: Date.now },
    actualizadoEn: { type: Date, default: Date.now }
}, {
    collection: "services",
    versionKey: false
});

ServiceSchema.pre("save", function (next) {
    this.actualizadoEn = Date.now();
    next();
});

export default model("Service", ServiceSchema);
