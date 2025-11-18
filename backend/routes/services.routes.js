// backend/routes/services.routes.js
import express from "express";
import {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} from "../controllers/services.controller.js";

const router = express.Router();

/**
 * Rutas servicios
 * GET    /api/services
 * GET    /api/services/:id
 * POST   /api/services
 * PUT    /api/services/:id
 * DELETE /api/services/:id
 */
router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", createService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
