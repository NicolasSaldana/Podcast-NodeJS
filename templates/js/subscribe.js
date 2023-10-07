function subscribe() {
    var miInput = document.getElementById("miInput");
    var inputValue = miInput.value.trim();

    var mensajeElement = document.getElementById("mensaje");
    mensajeElement.style.display = "none";

    var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(inputValue)) {
      mensajeElement.style.display = "block";
      mensajeElement.textContent = "Ingresa un correo electrónico válido";
      mensajeElement.classList.remove("alert-success");
      mensajeElement.classList.add("alert-danger");
      miInput.value = "";
      return;
    }

    var domain = inputValue.split("@")[1];

    // Verificar si el dominio está permitido
    if (domain !== "gmail.com" && domain !== "yahoo.com" && domain !== "outlook.com") {
      mensajeElement.style.display = "block";
      mensajeElement.textContent = "Solo se permiten correos electrónicos de Gmail, Yahoo y Outlook";
      mensajeElement.classList.remove("alert-success");
      mensajeElement.classList.add("alert-danger");
      miInput.value = "";
      return;
    }

    event.preventDefault();

    fetch('http://localhost:3000/subemail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ subemail: miInput.value })
    })
      .then(response => response.json())
      .then(data => {
        miInput.value = "";
        console.log(data.message); 

        mensajeElement.style.display = "block";
        mensajeElement.textContent = data.message;

        if (data.message === "Correo electrónico guardado en la base de datos") {
          mensajeElement.classList.remove("alert-danger");
          mensajeElement.classList.remove("alert-primary");
          mensajeElement.classList.add("alert-success");
        } else if (data.message === "El correo electrónico ya existe en la base de datos") {
          mensajeElement.classList.remove("alert-primary");
          mensajeElement.classList.add("alert-danger");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }