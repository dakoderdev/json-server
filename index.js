const API_URL = "http://localhost:3000/alumnos";

let alumnos = [];
let editingId = null;
let toastTimer = null;

const tbody = document.getElementById("tabla-alumnos");
const totalEl = document.getElementById("total-alumnos");
const formContainer = document.getElementById("form-container");
const formTitle = document.getElementById("form-title");
const form = document.getElementById("alumno-form");
const btnToggle = document.getElementById("btn-toggle-form");
const btnCancel = document.getElementById("btn-cancel");
const btnSubmit = document.getElementById("btn-submit");
const toast = document.getElementById("toast");



function showToast(message, type = "success") {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.className = `toast toast--${type}`;
  toastTimer = setTimeout(() => {
    toast.className = "toast hidden";
  }, 3000);
}

function clearValidation() {
  ["nombre", "apellido", "email"].forEach((id) => {
    document.getElementById(id).classList.remove("invalid");
  });
}

const comisionSelect = document.getElementById("comision-id");

let currentComision = comisionSelect.value;

document.getElementById("comision").placeholder = currentComision.toUpperCase();

function renderComision(comision) {
  currentComision = comision;
  document.getElementById("comision").placeholder = currentComision.toUpperCase();
  const filtered = alumnos.filter((a) => a.comision.toLowerCase() === comision.toLowerCase());
  totalEl.textContent = filtered.length;
  if (!filtered.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="table__empty">No hay alumnos en la comisión ${comision}.</td></tr>`;
    return;
  }
  renderRows();
}

comisionSelect.addEventListener("change", () => renderComision(comisionSelect.value));

function validateAlumno(data) {
  clearValidation();
  let valid = true;

  if (!data.nombre.trim()) {
    document.getElementById("nombre").classList.add("invalid");
    valid = false;
  }

  if (!data.apellido.trim()) {
    document.getElementById("apellido").classList.add("invalid");
    valid = false;
  }

  if (!data.email.trim()) {
    document.getElementById("email").classList.add("invalid");
    valid = false;
  }

  if (data.comision && !["a", "b", "c"].includes(data.comision.toLowerCase())) {
    document.getElementById("comision").classList.add("invalid");
    valid = false;
  }

  return valid;
}

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

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = {
    nombre: document.getElementById("nombre").value,
    apellido: document.getElementById("apellido").value,
    edad: Number(document.getElementById("edad").value),
    email: document.getElementById("email").value,
    comision: document.getElementById("comision").value || currentComision,
    activo: document.getElementById("activo").checked,
  };

  if (!validateAlumno(data)) {
    showToast("Completá los campos obligatorios", "error");
    return;
  }

  if (editingId !== null) updateAlumno(editingId, { ...data, id: editingId });
  else createAlumno(data);
});

async function loadAlumnos() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Error al cargar alumnos");
    alumnos = await res.json();
    renderRows();
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function createAlumno(data) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al crear alumno");

    const nuevo = await res.json();
    alumnos.push(nuevo);
    renderRows();
    closeForm();
    showToast("Alumno agregado correctamente");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function updateAlumno(id, data) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Error al actualizar alumno");

    const actualizado = await res.json();
    alumnos = alumnos.map((a) => (a.id === id ? actualizado : a));
    renderRows();
    closeForm();
    showToast("Alumno actualizado correctamente");
  } catch (err) {
    showToast(err.message, "error");
  }
}

async function deleteAlumno(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Error al eliminar alumno");

    alumnos = alumnos.filter((a) => a.id !== id);
    renderRows();
    showToast("Alumno eliminado");
  } catch (err) {
    showToast(err.message, "error");
  }
}


function handleEdit(id) {
    const alumno = alumnos.find(a => a.id === id);
    if (!alumno) return;

    editingId = id;

    formTitle.textContent = "Editar Estudiante";
    btnSubmit.textContent = "Actualizar";

    document.getElementById("nombre").value = alumno.nombre;
    document.getElementById("apellido").value = alumno.apellido;
    document.getElementById("edad").value = alumno.edad;
    document.getElementById("email").value = alumno.email;
    document.getElementById("comision").value = alumno.comision;
    document.getElementById("activo").checked = alumno.activo;

    formContainer.classList.remove("hidden");
}

function handleDelete(id) {
    const alumno = alumnos.find(a => a.id === id);
    if (!alumno) return;

    const confirmed = confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`);
    if (confirmed) deleteAlumno(id);
}

loadAlumnos();
