// backend/controllers/users.controller.js
// CRUD usuarios: listar, obtener, actualizar, eliminar
// Requiere coherencia con user.model.js: campos nombre, email, password, role

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

/**
 * getUsers - devuelve todos los usuarios (sin passwords)
 */
export async function getUsers(req, res) {
    try {
        const users = await User.find().select("-password").sort({ creadoEn: -1 });
        return res.json({ ok: true, data: users });
    } catch (err) {
        console.error("Error getUsers:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}

/**
 * getUserById - devuelve un usuario por id
 */
export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        return res.json({ ok: true, data: user });
    } catch (err) {
        console.error("Error getUserById:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}

/**
 * updateUser - actualiza campos de usuario (nombre, email, password, role)
 * Si se envía password, se hashea antes de guardar.
 */
export async function updateUser(req, res) {
    try {
        const { id } = req.params;
        const { nombre, email, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        if (nombre) user.nombre = nombre.trim();
        if (email) user.email = email.toLowerCase().trim();
        if (typeof role !== "undefined") user.role = role;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        const userSafe = await User.findById(id).select("-password");
        return res.json({ ok: true, message: "Usuario actualizado", data: userSafe });
    } catch (err) {
        console.error("Error updateUser:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}

/**
 * deleteUser - elimina usuario por id
 */
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
        return res.json({ ok: true, message: "Usuario eliminado" });
    } catch (err) {
        console.error("Error deleteUser:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}