// frontend/src/services/empleadosService.js
import API from '../api/api';

// Crear un nuevo empleado (POST /api/empleados)
export const crearEmpleado = async (empleadoData) => {
    const response = await API.post("/empleados", empleadoData);
    return response.data;
};

// Obtener todos los empleados (GET /api/empleados)
export const obtenerEmpleados = async () => {
    const response = await API.get("/empleados");
    return response.data;
};

// Obtener empleado por ID (GET /api/empleados/:id)
export const obtenerEmpleadoPorId = async (id) => {
    const response = await API.get(`/empleados/${id}`);
    return response.data;
};

// Actualizar empleado (PUT /api/empleados/:id)
export const actualizarEmpleado = async (id, empleadoData) => {
    const response = await API.put(`/empleados/${id}`, empleadoData);
    return response.data;
};

// Eliminar empleado (DELETE /api/empleados/:id)
export const eliminarEmpleado = async (id) => {
    const response = await API.delete(`/empleados/${id}`);
    return response.data;
};