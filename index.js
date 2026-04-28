import { state } from "./utils/state.js";
import { renderRows, renderComision } from "./utils/render.js";
import { validateAlumno, clearValidation } from "./utils/validate.js";
import { loadAlumnos, createAlumno, updateAlumno, deleteAlumno } from "./utils/crud.js";
import { initHandlers, handleEdit, handleDelete } from "./utils/handlers.js";

const formContainer = document.getElementById("form-container");
const formTitle = document.getElementById("form-title");
const form = document.getElementById("alumno-form");
const btnToggle = document.getElementById("btn-toggle-form");
const btnCancel = document.getElementById("btn-cancel");
const btnSubmit = document.getElementById("btn-submit");
const toast = document.getElementById("toast");
const comisionSelect = document.getElementById("comision-id");

initHandlers({ showToast, formContainer, formTitle, btnSubmit });

state.currentComision = comisionSelect.value;
document.getElementById("comision").placeholder = state.currentComision.toUpperCase();

function showToast(message, type = "success") {
  clearTimeout(state.toastTimer);
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  state.toastTimer = setTimeout(() => { toast.className = "toast hidden"; }, 3000);
}

function openForm(mode = "create") {
  state.editingId = null;
  form.reset();
  clearValidation();
  if (mode === "create") {
    formTitle.textContent = "Agregar Estudiante";
    btnSubmit.textContent = "Guardar";
  }
  formContainer.classList.remove("hidden");
}

function closeForm() {
  formContainer.classList.add("hidden");
  form.reset();
  clearValidation();
  state.editingId = null;
}

comisionSelect.addEventListener("change", () => renderComision(comisionSelect.value));
btnToggle.addEventListener("click", () => formContainer.classList.contains("hidden") ? openForm() : closeForm());
btnCancel.addEventListener("click", closeForm);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    edad: Number(document.getElementById("edad").value),
    email: document.getElementById("email").value,
    comision: document.getElementById("comision").value || state.currentComision,
    activo: document.getElementById("activo").checked,
  };
  if (!validateAlumno(data)) { showToast("Completá los campos obligatorios", "error"); return; }
  if (state.editingId !== null) updateAlumno(state.editingId, { ...data, id: state.editingId }, showToast, closeForm);
  else createAlumno(data, showToast, closeForm);
});

loadAlumnos(showToast);