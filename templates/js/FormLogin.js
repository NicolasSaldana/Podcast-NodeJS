function FormLogin() {
    var mensajelogin = document.getElementById("mensajelogin");
    mensajelogin.classList.remove("d-none");

    var email = document.querySelector('#email').value;
    var contraseña = document.querySelector('#contraseña').value;

    if (email === "" && contraseña === "") {
      mensajelogin.textContent = "Complete los campos obligatorios";
      return;
    }

    if (email === "" || contraseña === "") {
      if (email === "") {
        mensajelogin.textContent = "Complete el campo email";
        return;
      } else {
        mensajelogin.textContent = "Complete el campo contraseña";
        return;
      }
    }

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      event.preventDefault();
      mensajelogin.textContent = "Formato del correo electrónico invalido.";
      return;
    }

    if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
      event.preventDefault();
      console.log('El correo electrónico no es válido');
      mensajelogin.textContent = "Recuerda solo se permiten correos electrónicos de Gmail, Yahoo y Outlook.";
      return;
    }


    const data = {
      email: email,
      contraseña: contraseña,
    }

    event.preventDefault();
    fetch('/prelogin', {
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
        mensajelogin.classList.remove("alert-primary");
        mensajelogin.classList.add("alert-danger");
        mensajelogin.textContent = data.message;
      })
      .catch(error => {
        console.error(error);
      });
  }