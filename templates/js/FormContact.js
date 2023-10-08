function FormContact() {

    var mensajeElement = document.getElementById("mensajecontacto");
    mensajeElement.classList.remove("d-none");

    const nombre = document.querySelector('#c_fname').value;
    const apellido = document.querySelector('#c_lname').value;
    const email = document.querySelector('#c_email').value;
    const tema = document.querySelector('#c_subject').value;
    const mensaje = document.querySelector('#c_message').value;

    if (nombre === "" && email === "" && tema === "" && mensaje === "") {
        mensajeElement.textContent = "Complete los campos obligatorios";
        return;
    }

    const camposIncompletos = [];

    if (nombre === "") {
        camposIncompletos.push("nombre");
    }
    if (email === "") {
        camposIncompletos.push("email");
    }
    if (tema === "") {
        camposIncompletos.push("tema");
    }
    if (mensaje === "") {
        camposIncompletos.push("mensaje");
    }

    if (camposIncompletos.length > 0) {
        const camposTexto = camposIncompletos.join(", ");
        if (camposIncompletos.length === 1) {
            mensajeElement.classList.remove("alert-primary");
            mensajeElement.classList.add("alert-danger");
            mensajeElement.textContent = `El campo ${camposTexto} está vacío.`;
            return;
        }
        console.log('Complete los campos obligatorios');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = `Los campos ${camposTexto} están vacíos.`;
        return;
    }
    
    const nombreRegex = /^[^\d\s]{6,}$/;
    if (!nombreRegex.test(nombre)) {
        event.preventDefault();
        console.log('El nombre no es válido');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El nombre no es válido. Minimo 6 caracteres y sin números"; 
        return;
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        event.preventDefault();
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El correo electrónico no es válido";
        return;
    }

    // if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
    //     console.log('El correo electrónico no es válido');
    //     return;
    // }

    const data = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        tema: tema,
        mensaje: mensaje
    };

    event.preventDefault(); // Evitar que el formulario se envíe de forma predeterminada
    fetch('/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            mensajeElement.classList.remove("alert-primary");
            mensajeElement.classList.remove("alert-danger");
            mensajeElement.classList.add("alert-success");
            mensajeElement.textContent = data.message;
        })
        .catch(error => {
            console.error(error);
        });
}