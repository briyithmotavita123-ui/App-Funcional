// backend/controllers/products.controller.js
// Controlador CRUD para Productos (coherente con product.model.js)

import Product from "../models/product.model.js";

/**
 * getProducts - devuelve lista de productos (opciones de paginación simples)
 */
export async function getProducts(req, res) {
    try {
        // Soporta paginado básico mediante query params: ?page=1&limit=10
        const page = Math.max(parseInt(req.query.page || "1", 10), 1);
        const limit = Math.max(parseInt(req.query.limit || "20", 10), 1);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Product.find().skip(skip).limit(limit).sort({ creadoEn: -1 }),
            Product.countDocuments()
        ]);

        return res.json({ ok: true, data: items, meta: { page, limit, total } });
    } catch (err) {
        console.error("Error getProducts:", err);
        return res.status(500).json({ ok: false, message: "Error al listar productos", error: err.message });
    }
}

/**
 * getProductById - devuelve producto por id
 */
export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const prod = await Product.findById(id);
        if (!prod) return res.status(404).json({ ok: false, message: "Producto no encontrado" });
        return res.json({ ok: true, data: prod });
    } catch (err) {
        console.error("Error getProductById:", err);
        return res.status(500).json({ ok: false, message: "Error del servidor", error: err.message });
    }
}

/**
 * createProduct - crear un nuevo producto
 * Requiere: nombre, descripcion, precio, stock
 */
export async function createProduct(req, res) {
    try {
        const { nombre, descripcion, precio, stock, creadoPor } = req.body;

        if (!nombre || !descripcion || typeof precio === "undefined" || typeof stock === "undefined") {
            return res.status(400).json({ ok: false, message: "nombre, descripcion, precio y stock son obligatorios" });
        }

        const nuevo = new Product({
            nombre: String(nombre).trim(),
            descripcion: String(descripcion).trim(),
            precio: Number(precio),
            stock: Number(stock),
            creadoPor: creadoPor || null
        });

        const saved = await nuevo.save();
        return res.status(201).json({ ok: true, message: "Producto creado", data: saved });
    } catch (err) {
        console.error("Error createProduct:", err);
        return res.status(500).json({ ok: false, message: "Error al crear producto", error: err.message });
    }
}

/**
 * updateProduct - actualiza producto por id
 */
export async function updateProduct(req, res) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock } = req.body;

        const prod = await Product.findById(id);
        if (!prod) return res.status(404).json({ ok: false, message: "Producto no encontrado" });

        if (nombre) prod.nombre = String(nombre).trim();
        if (descripcion) prod.descripcion = String(descripcion).trim();
        if (typeof precio !== "undefined") prod.precio = Number(precio);
        if (typeof stock !== "undefined") prod.stock = Number(stock);

        await prod.save();
        return res.json({ ok: true, message: "Producto actualizado", data: prod });
    } catch (err) {
        console.error("Error updateProduct:", err);
        return res.status(500).json({ ok: false, message: "Error al actualizar producto", error: err.message });
    }
}

/**
 * deleteProduct - elimina un producto por id
 */
export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ ok: false, message: "Producto no encontrado" });
        return res.json({ ok: true, message: "Producto eliminado" });
    } catch (err) {
        console.error("Error deleteProduct:", err);
        return res.status(500).json({ ok: false, message: "Error al eliminar producto", error: err.message });
    }
}