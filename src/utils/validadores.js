export function validateAlumno(data) {
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