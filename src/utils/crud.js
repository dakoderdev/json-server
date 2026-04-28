async export function loadAlumnos() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al cargar alumnos");
        alumnos = await res.json();
        renderRows();
    } catch (err) {
        showToast(err.message, "error");
    }
}

async export function createAlumno(data) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
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

async export function updateAlumno(id, data) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!res.ok) throw new Error("Error al actualizar alumno");

        const actualizado = await res.json();
        alumnos = alumnos.map(a => a.id === id ? actualizado : a);
        renderRows();
        closeForm();
        showToast("Alumno actualizado correctamente");
    } catch (err) {
        showToast(err.message, "error");
    }
}

async export function deleteAlumno(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (!res.ok) throw new Error("Error al eliminar alumno");

        alumnos = alumnos.filter(a => a.id !== id);
        renderRows();
        showToast("Alumno eliminado");
    } catch (err) {
        showToast(err.message, "error");
    }
}

export function handleEdit(id) {
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

export function handleDelete(id) {
    const alumno = alumnos.find(a => a.id === id);
    if (!alumno) return;

    const confirmed = confirm(`¿Eliminar a ${alumno.nombre} ${alumno.apellido}?`);
    if (confirmed) deleteAlumno(id);
}