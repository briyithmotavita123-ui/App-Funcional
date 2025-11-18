// backend/routes/products.routes.js
import express from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";

const router = express.Router();

/**
 * Rutas productos
 * GET    /api/products
 * GET    /api/products/:id
 * POST   /api/products
 * PUT    /api/products/:id
 * DELETE /api/products/:id
 */
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
