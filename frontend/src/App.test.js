/**
 * @file App.test.js
 * @description Pruebas unitarias y de integración para la aplicación principal.
 * Estas pruebas validan la estructura general de la interfaz, el flujo básico
 * de registro de empleados, el manejo de errores y la comunicación con el backend.
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

// Mock del fetch global para simular las peticiones HTTP al backend
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            nombre: "Laura Gómez",
            cargo: "Desarrolladora Frontend",
            salario: 4500000,
            email: "laura@example.com",
          },
        ]),
    })
  );
});

// Limpieza después de cada test
afterEach(() => {
  jest.clearAllMocks();
});

describe("🧪 Pruebas de la Aplicación Principal (App.jsx)", () => {
  test("Debe renderizar correctamente el título principal", () => {
    render(<App />);
    const titulo = screen.getByText(/Registro de Empleados/i);
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveStyle("font-family: 'Poppins', cursive");
  });

  test("Debe mostrar la tabla de empleados con datos cargados", async () => {
    render(<App />);
    const fila = await waitFor(() => screen.getByText(/Laura Gómez/i));
    expect(fila).toBeInTheDocument();
  });

  test("Debe mostrar un formulario con los campos requeridos", () => {
    render(<App />);
    const nombreInput = screen.getByPlaceholderText(/Nombre del empleado/i);
    const cargoInput = screen.getByPlaceholderText(/Cargo o puesto/i);
    const salarioInput = screen.getByPlaceholderText(/Salario mensual/i);
    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);

    expect(nombreInput).toBeInTheDocument();
    expect(cargoInput).toBeInTheDocument();
    expect(salarioInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  test("Debe permitir escribir en los campos del formulario", () => {
    render(<App />);
    const nombreInput = screen.getByPlaceholderText(/Nombre del empleado/i);
    fireEvent.change(nombreInput, { target: { value: "Carlos Pérez" } });
    expect(nombreInput.value).toBe("Carlos Pérez");
  });

  test("Debe enviar el formulario correctamente", async () => {
    render(<App />);

    const nombre = screen.getByPlaceholderText(/Nombre del empleado/i);
    const cargo = screen.getByPlaceholderText(/Cargo o puesto/i);
    const salario = screen.getByPlaceholderText(/Salario mensual/i);
    const email = screen.getByPlaceholderText(/Correo electrónico/i);
    const boton = screen.getByRole("button", { name: /Registrar Empleado/i });

    fireEvent.change(nombre, { target: { value: "Carlos Pérez" } });
    fireEvent.change(cargo, { target: { value: "Ingeniero de Datos" } });
    fireEvent.change(salario, { target: { value: "5800000" } });
    fireEvent.change(email, { target: { value: "carlos@example.com" } });
    fireEvent.click(boton);

    await waitFor(() =>
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/empleados"),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      )
    );
  });

  test("Debe mostrar un mensaje de error si el backend no responde", async () => {
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false, status: 500 })
    );

    render(<App />);

    const boton = screen.getByRole("button", { name: /Registrar Empleado/i });
    fireEvent.click(boton);

    const mensaje = await waitFor(() =>
      screen.getByText(/Error al conectar con el servidor/i)
    );
    expect(mensaje).toBeInTheDocument();
  });

  test("Debe tener un diseño visual coherente y bien estructurado", () => {
    render(<App />);
    const contenedor = screen.getByTestId("app-container");
    expect(contenedor).toHaveStyle(`
      background-color: #f9f7fa;
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    `);
  });
});

describe("🎨 Pruebas de Estilo y Accesibilidad", () => {
  test("Los botones deben tener colores pasteles", () => {
    render(<App />);
    const boton = screen.getByRole("button", { name: /Registrar Empleado/i });
    expect(boton).toHaveStyle(`
      background-color: #b8c0ff;
      color: #333;
      border-radius: 8px;
      font-weight: bold;
      transition: all 0.3s ease;
    `);
  });

  test("Los títulos deben tener una fuente semi-cursiva elegante", () => {
    render(<App />);
    const titulo = screen.getByText(/Registro de Empleados/i);
    expect(titulo).toHaveStyle(`
      font-family: 'Poppins', cursive;
      color: #5d3fd3;
      text-shadow: 1px 1px 3px rgba(0,0,0,0.1);
    `);
  });

  test("El componente debe ser accesible con roles y etiquetas ARIA", () => {
    render(<App />);
    const form = screen.getByRole("form");
    const tabla = screen.getByRole("table");
    expect(form).toBeInTheDocument();
    expect(tabla).toBeInTheDocument();
  });
});
