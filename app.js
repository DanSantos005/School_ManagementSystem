document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario-alumno');
    const botonAgregarMateria = document.getElementById('agregar-materia');
    const materiasContainer = document.getElementById('materias');

    botonAgregarMateria.addEventListener('click', (e) => {
        e.preventDefault();
        const div = document.createElement('div');
        div.innerHTML = `
            <label for="materia">Materia:</label>
            <input type="text" name="materia">
            <label for="calificacion">Calificación:</label>
            <input type="number" name="calificacion" min="0" max="10">
        `;
        materiasContainer.appendChild(div);
    });

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const apellidos = document.getElementById('apellidos').value;
        const edad = document.getElementById('edad').value;
        const alumno = new Alumno(nombre, apellidos, edad);

        const materiasInputs = materiasContainer.querySelectorAll('div');
        materiasInputs.forEach(div => {
            const materia = div.querySelector('input[name="materia"]').value;
            const calificacion = parseFloat(div.querySelector('input[name="calificacion"]').value);
            if (materia && !isNaN(calificacion)) { // Asegurarse de que ambos campos estén llenos correctamente
                const nuevaMateria = new Materia(materia);
                nuevaMateria.calificaciones.push(calificacion);
                alumno.agregarMateria(nuevaMateria);
            }
        });

        console.log(alumno); // Aquí puedes hacer algo con el objeto alumno, como añadirlo a una lista en la UI
        // Resetea el formulario después de registrar al alumno
        formulario.reset();
    });
});
