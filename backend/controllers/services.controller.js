// backend/controllers/services.controller.js
// Controlador CRUD para Servicios (coherente con service.model.js)

import Service from "../models/service.model.js";

/**
 * getServices - lista de servicios (con paginación básica)
 */
export async function getServices(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Service.find().skip(skip).limit(limit).sort({ creadoEn: -1 }),
            Service.countDocuments()
        ]);

        return res.json({ ok: true, data: items, meta: { page, limit, total } });
    } catch (err) {
        console.error("Error getServices:", err);
        return res.status(500).json({ ok: false, message: "Error listando servicios", error: err.message });
    }
}

/**
 * getServiceById
 */
export async function getServiceById(req, res) {
    try {
        const { id } = req.params;
        const svc = await Service.findById(id);
        if (!svc) return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
        return res.json({ ok: true, data: svc });
    } catch (err) {
        console.error("Error getServiceById:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}

/**
 * createService - crear un nuevo servicio
 * Requiere: nombre, descripcion, precio, duracion (minutos)
 */
export async function createService(req, res) {
    try {
        const { nombre, descripcion, precio, duracion, proveedor, creadoPor } = req.body;

        if (!nombre || !descripcion || typeof precio === "undefined" || typeof duracion === "undefined") {
            return res.status(400).json({ ok: false, message: "nombre, descripcion, precio y duracion son obligatorios" });
        }

        const nuevo = new Service({
            nombre: String(nombre).trim(),
            descripcion: String(descripcion).trim(),
            precio: Number(precio),
            duracion: Number(duracion),
            proveedor: proveedor ? String(proveedor).trim() : undefined,
            creadoPor: creadoPor || null
        });

        const saved = await nuevo.save();
        return res.status(201).json({ ok: true, message: "Servicio creado", data: saved });
    } catch (err) {
        console.error("Error createService:", err);
        return res.status(500).json({ ok: false, message: "Error al crear servicio", error: err.message });
    }
}

/**
 * updateService - actualizar servicio por id
 */
export async function updateService(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion, proveedor } = req.body;

        const svc = await Service.findById(id);
        if (!svc) return res.status(404).json({ ok: false, message: "Servicio no encontrado" });

        if (nombre) svc.nombre = String(nombre).trim();
        if (descripcion) svc.descripcion = String(descripcion).trim();
        if (typeof precio !== "undefined") svc.precio = Number(precio);
        if (typeof duracion !== "undefined") svc.duracion = Number(duracion);
        if (typeof proveedor !== "undefined") svc.proveedor = proveedor;

        await svc.save();
        return res.json({ ok: true, message: "Servicio actualizado", data: svc });
    } catch (err) {
        console.error("Error updateService:", err);
        return res.status(500).json({ ok: false, message: "Error al actualizar servicio", error: err.message });
    }
}

/**
 * deleteService - eliminar servicio por id
 */
export async function deleteService(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Service.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ ok: false, message: "Servicio no encontrado" });
        return res.json({ ok: true, message: "Servicio eliminado" });
    } catch (err) {
        console.error("Error deleteService:", err);
        return res.status(500).json({ ok: false, message: "Error al eliminar servicio", error: err.message });
    }
}