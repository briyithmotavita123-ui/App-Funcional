// backend/routes/users.routes.js
import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controllers/users.controller.js";

const router = express.Router();

/**
 * Rutas usuarios (CRUD)
 * GET    /api/users
 * GET    /api/users/:id
 * PUT    /api/users/:id
 * DELETE /api/users/:id
 */
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
