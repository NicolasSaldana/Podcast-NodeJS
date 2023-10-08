
const express = require('express');
const session = require('express-session');
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // para hashear una contraseña
const path = require('path');
const { error } = require('console');
require('dotenv').config();


const app = express();
const port = 3000

app.use("/assets", express.static(path.join(__dirname, "/assets")))
app.set('views', path.join(__dirname, "/views"))
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(__dirname + 'href="/css/style.css">'));
app.use("/templates", express.static(path.join(__dirname, "/templates")));

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configurar el middleware de body-parser para manejar solicitudes POST
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Express session
app.use(session({
  secret: process.env.SESSION_SCRT,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 60 * 60 * 1000
  }
}));

app.get('/', (req, res) => {
  return res.render('index.ejs');
});


app.get('/prelogin', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/login.html"));
});

app.get('/preregister', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/register.html"));

})

app.post('/contact', (req, res) => {
  const { nombre, apellido, email, tema, mensaje } = req.body;

  if (!nombre || !email || !tema || !mensaje) {
    console.log('Complete los campos obligatorios');
    res.status(400).json({ error: "Complete los campos obligatorios" });
    res.redirect('/');
  }
  const camposIncompletos = [];

  if (!nombre) {
    camposIncompletos.push("nombre");
  }
  if (!email) {
    camposIncompletos.push("email");
  }
  if (!tema) {
    camposIncompletos.push("tema");
  }
  if (!mensaje) {
    camposIncompletos.push("mensaje");
  }

  if (camposIncompletos.length > 0) {
    console.log('Complete los campos obligatorios');
    return res.status(400).json({ error: "Complete los campos obligatorios" });
  }

  const nombreRegex = /^[^\d\s]{6,}$/;
  if (!nombreRegex.test(nombre)) {
    console.log('El nombre no es válido');
    return res.status(400).json({ error: "El nombre no es válido. Mínimo 6 caracteres y sin números" });
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    console.log('El correo electrónico no es válido');
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  const sql = `INSERT INTO contacto (nombre, apellido, email, tema, mensaje) VALUES (?, ?, ?, ?, ?)`;
  const values = [nombre, apellido, email, tema, mensaje];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error al guardar los datos: ', error);
      return res.status(500).send('Error al guardar los datos en la base de datos.');
    } else {
      var saved = 'Datos guardados correctamente en la base de datos.';
      console.log('Datos guardados correctamente en la base de datos.');
      return res.status(200).json({ message: saved });
    }
  });
});


app.post("/subemail", (req, res) => {
  const { subemail } = req.body;

  if (!subemail) {
    console.log('El correo electrónico no puede estar vacío');
    return res.status(400).json({ error: "El correo electrónico no puede estar vacío" });
  }

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(subemail)) {
    console.log('El correo electrónico no es válido');
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  const domain = subemail.split("@")[1];
  if (domain !== 'gmail.com' && domain !== 'yahoo.com' && domain !== 'outlook.com') {
    console.log('El correo electrónico no es válido');
    return res.status(400).json({ error: "El correo electrónico no es válido" });
  }

  const selectSql = 'SELECT COUNT(*) AS count FROM subemail WHERE subemail = ?';
  const selectValues = [subemail];

  db.query(selectSql, selectValues, (err, result) => {

    if (err) {
      console.error('Error al verificar el correo electrónico:', err);
      return res.status(500).json({ error: 'Error al verificar el correo electrónico' });
    }

    const count = result[0].count;

    if (count > 0) {
      var error = 'El correo electrónico ya existe en la base de datos';
      console.log('El correo electrónico ya existe en la base de datos:', subemail);
      return res.status(200).json({ message: error });
    } else {
      const insertSql = 'INSERT INTO subemail (subemail) VALUES (?)';
      const insertValues = [subemail];

      db.query(insertSql, insertValues, (err, result) => {
        if (err) {
          var errorsaved = 'Error al guardar el correo electrónico en la base de datos';
          return res.status(500).json({ message: errorsaved });
        }
        var saved = 'Correo electrónico guardado en la base de datos';
        console.log('Correo electrónico guardado en la base de datos:', subemail);
        return res.status(200).json({ message: saved });
      });
    }
  });

  console.log("working")
});

//Conectar a la BD
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos.');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});

