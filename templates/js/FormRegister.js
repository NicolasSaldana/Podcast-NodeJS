function FormRegister() {
    var mensajeregister = document.getElementById("mensajeregister");
    mensajeregister.classList.remove("d-none");

    var nombre = document.querySelector('#nombre').value;
    var email = document.querySelector('#email').value;
    var contraseña = document.querySelector('#contraseña').value;
    var rcontraseña = document.querySelector('#rcontraseña').value;

    if (nombre === "" && email === "" && contraseña === "" && rcontraseña === "") {
      mensajeregister.textContent = "Complete los campos obligatorios";
      return;
    }

    const camposIncompletos = [];

    if (nombre === "") {
      camposIncompletos.push("Nombre");
    }
    if (email === "") {
      camposIncompletos.push("Email");
    }
    if (contraseña === "") {
      camposIncompletos.push("Contraseña");
    }
    if (rcontraseña === "") {
      camposIncompletos.push("Repetir contraseña");
    }

    if (camposIncompletos.length > 0) {
      const camposTexto = camposIncompletos.join(", ");
      if (camposIncompletos.length === 1) {
        mensajeregister.classList.remove("alert-primary");
        mensajeregister.classList.add("alert-danger");
        mensajeregister.textContent = `El campo ${camposTexto} está vacío.`;
        return;
      }
      console.log('Complete los campos obligatorios');
      mensajeregister.classList.remove("alert-primary");
      mensajeregister.classList.add("alert-danger");
      mensajeregister.textContent = `Los campos ${camposTexto} están vacíos.`;
      return;
    }

    const nombreRegex = /^\.{1}|^.{0,2}$|\.+$/;
    if (nombreRegex.test(nombre)) {
      event.preventDefault();
      mensajeregister.textContent = "El nombre no es válido. Debe contener al menos 3 caracteres y no puede contener caracteres '.'";
      return;
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      event.preventDefault();
      mensajeregister.textContent = "El correo electrónico no es válido.";
      return;
    }

    if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
      event.preventDefault();
      console.log('El correo electrónico no es válido');
      mensajeregister.textContent = "Solo se permiten correos electrónicos de Gmail, Yahoo y Outlook.";
      return;
    }

    const contraseñatRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s).{5,}$/;
    if (!contraseñatRegex.test(contraseña)) {
      event.preventDefault();
      mensajeregister.textContent = "La contraseña no es valida. Debe contener al menos 5 caracteres, una letra mayúscula y un número.";
      return;
    }

    if (rcontraseña !== contraseña) {
      event.preventDefault();
      mensajeregister.textContent = "Las contraseñas no coinciden";
      return;
    }


    const data = {
      nombre: nombre,
      email: email,
      contraseña: contraseña,
      rcontraseña: rcontraseña
    };

    event.preventDefault();
    fetch('/preregister', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.redirected) {
          window.location.href = response.url;
        } else {
          return response.json();
        }
      })
      .then(data => {
        console.log(data.message);
        mensajeregister.classList.remove("alert-primary");
        mensajeregister.classList.add("alert-danger");
        mensajeregister.textContent = data.message;
      })
      .catch(error => {
        console.error(error);
      });
  }