import { state } from "./state.js";
import { renderRows } from "./render.js";

const API_URL = "http://localhost:3000/alumnos";

export async function loadAlumnos(showToast) {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar alumnos");
    state.alumnos = await res.json();
    renderRows();
  } catch (err) {
    showToast(err.message, "error");
  }
}

export async function createAlumno(data, showToast, closeForm) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al crear alumno");
    const nuevo = await res.json();
    state.alumnos.push(nuevo);
    renderRows();
    closeForm();
    showToast("Alumno agregado correctamente");
  } catch (err) {
    showToast(err.message, "error");
  }
}

export async function updateAlumno(id, data, showToast, closeForm) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Error al actualizar alumno");
    const actualizado = await res.json();
    state.alumnos = state.alumnos.map(a => a.id === id ? actualizado : a);
    renderRows();
    closeForm();
    showToast("Alumno actualizado correctamente");
  } catch (err) {
    showToast(err.message, "error");
  }
}

export async function deleteAlumno(id, showToast) {
  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar alumno");
    state.alumnos = state.alumnos.filter(a => a.id !== id);
    renderRows();
    showToast("Alumno eliminado");
  } catch (err) {
    showToast(err.message, "error");
  }
}