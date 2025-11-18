// backend/controllers/empleado.controller.js
import Empleado from "../models/empleado.model.js";

// Obtener todos los empleados
export const obtenerEmpleados = async (req, res) => {
    try {
        const empleados = await Empleado.find();
        res.json(empleados);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).json({ message: "Error al obtener empleados" });
    }
};

// Crear empleado
export const crearEmpleado = async (req, res) => {
    try {
        const { nombre, cargo, salario, correo } = req.body;

        if (!nombre || !cargo || !salario || !correo) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        const nuevoEmpleado = new Empleado({ nombre, cargo, salario, correo });
        await nuevoEmpleado.save();

        res.status(201).json(nuevoEmpleado);
    } catch (error) {
        console.error("Error al crear empleado:", error);
        res.status(400).json({ message: "Error al crear el empleado", error });
    }
};

// Obtener empleado por ID
export const obtenerEmpleadoPorId = async (req, res) => {
    try {
        const empleado = await Empleado.findById(req.params.id);
        if (!empleado) return res.status(404).json({ message: "Empleado no encontrado" });
        res.json(empleado);
    } catch (error) {
        console.error("Error al obtener empleado:", error);
        res.status(400).json({ message: "Error al obtener empleado" });
    }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
    try {
        const empleadoActualizado = await Empleado.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(empleadoActualizado);
    } catch (error) {
        console.error("Error al actualizar empleado:", error);
        res.status(400).json({ message: "Error al actualizar el empleado" });
    }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
    try {
        await Empleado.findByIdAndDelete(req.params.id);
        res.json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar empleado:", error);
        res.status(400).json({ message: "Error al eliminar empleado" });
    }
};
