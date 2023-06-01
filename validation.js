//check user
async function checkUser(username) {
    const response = await fetch('http://127.0.0.1:3000/valid-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username})
    });
    const result = await response.json();
    if (result.valid) {
        return true
    } else {
        return false //usuario ya existente
    }
}

let userInput = document.getElementById("username")
userInput.addEventListener('blur', async e => {
    let userInputValue = userInput.value
    if (!await checkUser(userInputValue)) {
        alert("Usuario ya existente")
        userInput.value = ""
        userInput.setAttribute("style", "border: 1px solid f#f0000 !important;")
    } else {
        userInput.setAttribute("style", "border: 1px solid #15ff00 !important;")
    }
})

//check email
async function checkEmail(email) {
    const response = await fetch('http://127.0.0.1:3000/valid-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
    });
    const result = await response.json();
    if (result.valid) {
        return true
    } else {
        return false //email ya existente
    }
}
let emailInput = document.getElementById("email")
emailInput.addEventListener('blur', async e => {
    let userEmailValue = emailInput.value
    if (!await checkEmail(userEmailValue)) {
        alert("Email ya existente")
        emailInput.value = ""
        emailInput.setAttribute("style", "border: 1px solid #ff0000 !important;")
    } else {
        emailInput.setAttribute("style", "border: 1px solid #15ff00 !important;")
    }
})

let register_form = document.getElementById("register-form");

register_form.addEventListener('submit', e => {
    e.preventDefault();
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;
    // Validación del nombre de usuario
    if (username.value.length < 5) {
        alert('El nombre de usuario debe tener al menos 5 caracteres.');
        return;
    }
    
    // Validación del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        alert('El correo electrónico no es válido.');
        return;
    }
    
    // Validación de la contraseña
    if (password.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres.');
        return;
    }
    if (password != repassword) {
        alert("Las contraseñas no coinciden")
        return;
    }
    
    // Envío del formulario si todos los datos son válidos
    register_form.submit();
})
