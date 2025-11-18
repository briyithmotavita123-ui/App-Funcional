💖 App Web Frontend

Este es el frontend de la aplicación web construido con React, diseñado con una estética pastel. Se conecta a la API RESTful de tu backend (Node.js/Express).

🚀 Cómo Iniciar

Asegúrate de que tu Backend está corriendo:

# En la carpeta de tu backend, usa el archivo server.js corregido
npm install
npm run dev 
# Debería correr en http://localhost:3000


Instalar dependencias del Frontend:

# En la carpeta del frontend
npm install react react-dom react-router-dom axios


Ejecutar el Frontend:

npm start 
# Normalmente corre en http://localhost:3001 o 4200, dependiendo de tu setup.


🛠️ Estructura del Proyecto

src/api/api.js: Configuración de Axios y manejo de tokens.

src/context/AuthContext.jsx: Manejo global del estado de autenticación (Login/Logout).

src/components/Employee*: Componentes CRUD para la gestión de Empleados.

src/pages/*: Las vistas principales (Home, Login, Register, Productos/Servicios/Usuarios).

🎨 Paleta de Colores

Morado Principal (#9370DB)

Rosa Secundario (#FFB6C1)

Menta Suave (#F0FFF0)

Café/Texto (#4A4A4A)