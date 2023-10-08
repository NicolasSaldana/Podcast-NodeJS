// function register() {
//     const nombre = document.getElementById('c_fname').value;
//     const email = document.getElementById('c_email').value;
//     const contraseña = document.getElementById('c_pass').value;
//     const recontraseña = document.getElementById('c_rpass').value;

//     const data = {
//         nombre: nombre,
//         email: email,
//         contraseña: contraseña,
//         recontraseña: recontraseña,
//     };

//     event.preventDefault();
//     fetch('/register', {
//         method: 'POST',
//         headers: {

//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data)
//     })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data.error);
//         })
//         .catch(error => {
//             console.error(error);
//         });
// }


