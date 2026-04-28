import { state } from "./state.js";
import { deleteAlumno } from "./crud.js";

let _showToast;
let _formContainer;
let _formTitle;
let _btnSubmit;

export function initHandlers({ showToast, formContainer, formTitle, btnSubmit }) {
  _showToast = showToast;
  _formContainer = formContainer;
  _formTitle = formTitle;
  _btnSubmit = btnSubmit;
}

export function handleEdit(id) {
  const alumno = state.alumnos.find(a => a.id === id);
  if (!alumno) return;
  state.editingId = id;
  _formTitle.textContent = "Editar Estudiante";
  _btnSubmit.textContent = "Actualizar";
  document.getElementById("nombre").value = alumno.nombre;
  document.getElementById("apellido").value = alumno.apellido;
  document.getElementById("edad").value = alumno.edad;
  document.getElementById("email").value = alumno.email;
  document.getElementById("comision").value = alumno.comision;
  document.getElementById("activo").checked = alumno.activo;
  _formContainer.classList.remove("hidden");
}

export function handleDelete(id) {
  const alumno = state.alumnos.find(a => a.id === id);
  if (!alumno) return;
  if (confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`)) deleteAlumno(id, _showToast);
}