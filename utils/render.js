import { state } from "./state.js";
import { handleEdit, handleDelete } from "./handlers.js";

const tbody = document.getElementById("tabla-alumnos");
const totalEl = document.getElementById("total-alumnos");

export function renderRows() {
  const visibles = state.alumnos
    .filter(a => a.comision.toLowerCase() === state.currentComision.toLowerCase())
    .sort((a, b) => a.nombre.localeCompare(b.nombre));

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
      <td class="td--active ${a.activo ? "td--yes" : "td--no"}"><span>${a.activo ? "Sí" : "No"}</span></td>
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

export function renderComision(comision) {
  state.currentComision = comision;
  document.getElementById("comision").placeholder = comision.toUpperCase();
  renderRows();
}