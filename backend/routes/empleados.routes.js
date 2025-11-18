import express from "express";
import Empleado from "../models/empleado.model.js";

const router = express.Router();

// ✅ Obtener todos los empleados
router.get("/", async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (error) {
        console.error("❌ Error al obtener empleados:", error);
        res.status(500).json({ message: "Error al obtener los empleados", error });
    }
});

// ✅ Crear un nuevo empleado
router.post("/", async (req, res) => {
    try {
        const { nombre, cargo, salario, correo } = req.body;

        if (!nombre || !cargo || !salario || !correo) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const nuevoEmpleado = new Empleado({ nombre, cargo, salario, correo });
        await nuevoEmpleado.save();

        res.status(201).json({
            message: "Empleado registrado exitosamente",
            empleado: nuevoEmpleado,
        });
    } catch (error) {
        console.error("❌ Error al crear empleado:", error);
        res.status(400).json({
            message: "Error al registrar el empleado",
            error: error.message,
        });
    }
});

// ✅ Actualizar empleado
router.put("/:id", async (req, res) => {
    try {
        const empleadoActualizado = await Empleado.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!empleadoActualizado)
            return res.status(404).json({ message: "Empleado no encontrado" });

        res.json(empleadoActualizado);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar el empleado", error });
    }
});

// ✅ Eliminar empleado
router.delete("/:id", async (req, res) => {
    try {
        const eliminado = await Empleado.findByIdAndDelete(req.params.id);
        if (!eliminado)
            return res.status(404).json({ message: "Empleado no encontrado" });

        res.json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar el empleado", error });
    }
});

export default router;
