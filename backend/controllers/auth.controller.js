// backend/controllers/auth.controller.js
// Registro y login de usuarios (bcryptjs + jsonwebtoken)
// Se incluye lógica para crear 8 Productos y 8 Servicios por defecto al registrar

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Product from "../models/product.model.js"; // Importación requerida
import Service from "../models/service.model.js"; // Importación requerida

const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_development";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "2h";

/**
 * Datos de ejemplo Kawaii (8 Productos y 8 Servicios)
 */
const DEFAULT_PRODUCTS = [
    { nombre: "Taza de Gatito 🐱", descripcion: "Taza de cerámica con diseño de gatito durmiendo, perfecta para tu café.", precio: 12.50, stock: 50 },
    { nombre: "Libreta de Estrellas ✨", descripcion: "Libreta de tapa dura con un patrón de estrellas pastel, ideal para notas mágicas.", precio: 8.99, stock: 120 },
    { nombre: "Llavero de Concha Marina 🐚", descripcion: "Llavero acrílico con forma de concha iridiscente, muy veraniego.", precio: 4.00, stock: 200 },
    { nombre: "Calcetines de Nubes ☁️", descripcion: "Set de calcetines cómodos con diseño de nubes esponjosas, ¡súper suaves!", precio: 9.99, stock: 80 },
    { nombre: "Stickers de Arcoíris 🌈", descripcion: "Paquete de stickers vinilo de temática arcoíris, para decorar tu laptop.", precio: 3.50, stock: 300 },
    { nombre: "Bolígrafo de Unicornio 🦄", descripcion: "Bolígrafo de gel de tinta negra con adorno de unicornio.", precio: 5.50, stock: 90 },
    { nombre: "Mochila Mini Rosa 🎒", descripcion: "Mochila pequeña color rosa pastel, perfecta para salidas rápidas.", precio: 25.00, stock: 30 },
    { nombre: "Bálsamo Labial de Melocotón 🍑", descripcion: "Bálsamo labial hidratante con aroma a melocotón y un toque de color.", precio: 6.25, stock: 150 },
];

const DEFAULT_SERVICES = [
    { nombre: "Consulta de Estilo Kawaii 💖", descripcion: "Sesión de 60 minutos para definir tu estilo personal con consejos de moda.", precio: 45.00, duracion: 60, proveedor: "Stylist Cuty" },
    { nombre: "Clase de Dibujo Chibi ✏️", descripcion: "Taller virtual de 90 minutos para aprender a dibujar personajes chibi paso a paso.", precio: 30.00, duracion: 90, proveedor: "Sensei Pastel" },
    { nombre: "Manicura de Gel Suave💅", descripcion: "Diseño de uñas con colores pastel y pequeños brillos, incluye top coat de larga duración.", precio: 25.00, duracion: 45, proveedor: "Nail Artist Sweet" },
    { nombre: "Masaje Relajante de Nubes 💆‍♀️", descripcion: "Masaje de cuerpo completo de 120 minutos con aceites aromáticos suaves y música relajante.", precio: 80.00, duracion: 120, proveedor: "Cloud Spa" },
    { nombre: "Sesión de Fotos Tierna 📸", descripcion: "Sesión de fotos de 45 minutos con ambientación 'cute' en estudio, 5 fotos editadas.", precio: 55.00, duracion: 45, proveedor: "Photo Kawaii" },
    { nombre: "Personalización de Fundas 📱", descripcion: "Diseño único para la funda de tu móvil. (Entrega en 3 días) con resina y charms.", precio: 18.00, duracion: 180, proveedor: "Case Maker" },
    { nombre: "Taller de Repostería Mágica 🎂", descripcion: "Clase de 180 minutos para hornear mini pasteles y galletas decoradas al estilo japonés.", precio: 40.00, duracion: 180, proveedor: "Sugar Fairy" },
    { nombre: "Soporte Técnico Amable 💻", descripcion: "Asistencia remota de 30 minutos para problemas informáticos menores y configuración de software.", precio: 20.00, duracion: 30, proveedor: "Tech Buddy" },
];


/**
 * register - crea un nuevo usuario en la colección users y le asigna datos iniciales.
 * Requiere: nombre, email, password en req.body
 */
export async function register(req, res) {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            return res.status(400).json({ ok: false, message: "nombre, email y password son obligatorios" });
        }

        // Validar existencia
        const existe = await User.findOne({ email: email.toLowerCase().trim() });
        if (existe) {
            return res.status(400).json({ ok: false, message: "El email ya está registrado" });
        }

        // Hashear contraseña
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);

        const nuevo = new User({
            nombre: nombre.trim(),
            email: email.toLowerCase().trim(),
            password: hashed,
            role: "user"
        });

        const usuarioGuardado = await nuevo.save();
        const userId = usuarioGuardado._id;

        // Generar token JWT
        const token = jwt.sign({ id: userId, email: usuarioGuardado.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        // --- CREACIÓN DE DATOS POR DEFECTO ---
        const productsToInsert = DEFAULT_PRODUCTS.map(p => ({ ...p, creadoPor: userId }));
        const servicesToInsert = DEFAULT_SERVICES.map(s => ({ ...s, creadoPor: userId }));

        await Promise.all([
            Product.insertMany(productsToInsert),
            Service.insertMany(servicesToInsert)
        ]);
        // ------------------------------------

        return res.status(201).json({
            ok: true,
            message: "✨ Registro exitoso y datos iniciales creados. ¡Bienvenid@ al mundo pastel!",
            data: {
                usuario: usuarioGuardado.toJSON(),
                token
            }
        });
    } catch (err) {
        console.error("Error en register:", err);
        return res.status(500).json({ ok: false, message: "Error en el servidor", error: err.message });
    }
}

/**
 * login - autentica usuario por email + password
 * Requiere: email, password en req.body
 */
export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "email y password son obligatorios" });
        }

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (!user) return res.status(400).json({ ok: false, message: "Usuario no encontrado" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ ok: false, message: "Credenciales inválidas" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        return res.json({
            ok: true,
            message: "Login exitoso",
            data: {
                usuario: user.toJSON(),
                token
            }
        });
    } catch (err) {
        console.error("Error en login:", err);
        return res.status(500).json({ ok: false, message: "Error en el servidor", error: err.message });
    }
}