import { validateAlumno } from "./src/utils/validadores.js";
import { loadAlumnos, createAlumno, updateAlumno, deleteAlumno } from "./src/api/alumnos.js";
const API_URL = "http://localhost:3000/alumnos";

let alumnos = [];
let editingId = null;

const tbody = document.getElementById("tabla-alumnos");
const totalEl = document.getElementById("total-alumnos");
const formContainer = document.getElementById("form-container");
const formTitle = document.getElementById("form-title");
const form = document.getElementById("alumno-form");
const btnToggle = document.getElementById("btn-toggle-form");
const btnCancel = document.getElementById("btn-cancel");
const btnSubmit = document.getElementById("btn-submit");
const toast = document.getElementById("toast");

let toastTimer = null;

function showToast(message, type = "success") {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.className = `toast toast--${type}`;
    toastTimer = setTimeout(() => {
        toast.className = "toast hidden";
    }, 3000);
}

function clearValidation() {
    ["nombre", "apellido", "email"].forEach(id => {
        document.getElementById(id).classList.remove("invalid");
    });
}

const comisionSelect = document.getElementById("comision-id");

let currentComision = comisionSelect.value;

document.getElementById("comision").placeholder = currentComision.toUpperCase();


function renderComision(comision) {
    currentComision = comision;
    document.getElementById("comision").placeholder = currentComision.toUpperCase();
    const filtered = alumnos.filter(a => a.comision.toLowerCase() === comision.toLowerCase());
    totalEl.textContent = filtered.length;
    if (!filtered.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="table__empty">No hay alumnos en la comisión ${comision}.</td></tr>`;
        return;
    }
    renderRows()
}

comisionSelect.addEventListener("change", () => renderComision(comisionSelect.value));

function openForm(mode = "create") {
    editingId = null;
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
    editingId = null;
}

btnToggle.addEventListener("click", () => {
    if (formContainer.classList.contains("hidden")) openForm();
    else closeForm();
});

btnCancel.addEventListener("click", closeForm);

function renderRows() {
    const visibles = alumnos.filter(
        a => a.comision.toLowerCase() === currentComision.toLowerCase()
    ).sort((a, b) => a.nombre.localeCompare(b.nombre));
    totalEl.textContent = visibles.length;

    if (!visibles.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="table__empty">No hay alumnos cargados.</td></tr>`;
        return;
    }

    tbody.innerHTML = visibles.map(a => `
        <tr>
            <td>${a.nombre}</td>
            <td>${a.apellido}</td>
            <td>${a.edad}</td>
            <td>${a.email}</td>
            <td class="td--active ${a.activo ? "td--yes" : "td--no"}">
                <span>${a.activo ? "Sí" : "No"}</span>
            </td>
            <td>
                <div class="td--actions">
                    <button id="edit-btn-${a.id}" class="btn-action btn-action--edit">Editar</button>
                    <button id="delete-btn-${a.id}" class="btn-action btn-action--delete">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join("");

    visibles.forEach(a => {
        document.getElementById(`edit-btn-${a.id}`).addEventListener("click", () => handleEdit(a.id));
        document.getElementById(`delete-btn-${a.id}`).addEventListener("click", () => handleDelete(a.id));
    });
}

form.addEventListener("submit", e => {
    e.preventDefault();

    const data = {
        nombre: document.getElementById("nombre").value,
        apellido: document.getElementById("apellido").value,
        edad: Number(document.getElementById("edad").value),
        email: document.getElementById("email").value,
        comision: document.getElementById("comision").value || currentComision,
        activo: document.getElementById("activo").checked
    };

    if (!validateAlumno(data)) {
        showToast("Completá los campos obligatorios", "error");
        return;
    }

    if (editingId !== null) updateAlumno(editingId, { ...data, id: editingId });
    else createAlumno(data);
});

loadAlumnos();