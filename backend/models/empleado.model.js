import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre es obligatorio"],
            trim: true,
        },
        cargo: {
            type: String,
            required: [true, "El cargo es obligatorio"],
            trim: true,
        },
        salario: {
            type: Number,
            required: [true, "El salario es obligatorio"],
            min: [0, "El salario no puede ser negativo"],
        },
        correo: {
            type: String,
            required: [true, "El correo es obligatorio"],
            trim: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Debe ser un correo válido"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Empleado", empleadoSchema);
