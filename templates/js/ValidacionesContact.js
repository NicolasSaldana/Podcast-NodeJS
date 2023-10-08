function validarCampo(nombre, email, tema, mensaje, mensajeElement) {
    const nombreRegex = /^[^\d\s]{3,}$/;
    if (!nombreRegex.test(nombre)) {
        event.preventDefault();
        console.log('El nombre no es válido');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El nombre no es válido. Mínimo 3 caracteres y sin números";
        return;
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        event.preventDefault();
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El correo electrónico no es válido";
        return;
    }

    if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
        event.preventDefault();
        console.log('El correo electrónico no es válido');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "Solo se permiten correos electrónicos de Gmail, Yahoo y Outlook.";
        return;
    }

    const temaRegex = /^[A-Za-z\s]+$/;
    if (!temaRegex.test(tema)) {
        event.preventDefault();
        console.log('El tema no es válido');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El tema no es válido. Debe contener solo letras y espacios";
        return;
    }

    const mensajeRegex = /^[A-Za-z0-9\s\.,?!'-]+$/;
    if (!mensajeRegex.test(mensaje)) {
        event.preventDefault();
        console.log('El mensaje no es válido');
        mensajeElement.classList.remove("alert-primary");
        mensajeElement.classList.add("alert-danger");
        mensajeElement.textContent = "El mensaje no es válido.";
        return;
    }
}

export {validarCampo};