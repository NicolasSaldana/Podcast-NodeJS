const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')
const path = require('path')
require('dotenv').config();

// Resto de tu configuración y rutas...

const app = express();
const port = 3000

app.use("/assets", express.static(path.join(__dirname, "/assets")))
app.set('views', path.join(__dirname, "/views"))
app.set('view engine', 'ejs');
app.use(cors());

app.use(express.static(__dirname + 'href="/css/style.css">'));
//Config de la BD
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
    maxAge: 60 * 60 * 1000 // 1 hour
  }
}));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, email, password: hashedPassword };
    const sql = 'INSERT INTO accounts SET ?';
    db.query(sql, user, (err, result) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).send('Error al registrar usuario');
        return;
      }
      console.log('Usuario registrado con éxito:', result);
      res.send('Usuario registrado con éxito');
    });
  } catch (err) {
    console.error('Error al hashear la contraseña:', err);
    res.status(500).send('Error al hashear la contraseña');
  }
});

//Ruta para el inicio de sesión de usuario
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  const sql = 'SELECT * FROM accounts WHERE username = ?';
  db.query(sql,
    username,
    async (err, result, fields) => {
      if (err) {
        console.error('Error al iniciar sesión:', err);
        res.status(500).send('Error al iniciar sesión');
        return;
      }
      if (result.length == 0) {
        console.log('Usuario no encontrado:', username);
        res.redirect('http://localhost:5500/login-error.html')
        return;
      }
      if (result.length > 0) {
        const hashedPassword = result[0].password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) throw err;
          if (result) {
            req.session.loggedin = true;
            req.session.username = username;
            console.log('Inicio de sesión exitoso para el usuario:', username);
            res.redirect('/home');
          } else {

            console.log('Contraseña incorrecta para el usuario:', username);
            res.redirect('http://localhost:5500/login-error.html')
            return
          }
        });
      }
    });
});



//Validacion de usuario y correo
//checking user and email
app.post('/valid-user', (req, res) => {
  const { username } = req.body;
  const sql = 'SELECT * FROM accounts WHERE username = ?';
  db.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      res.status(500).json({ error: 'Error al verificar usuario' });
    } else {
      if (result.length > 0) {
        res.status(200).json({ valid: false });
      } else {
        res.status(200).json({ valid: true });
      }
    }
  });
});

//valid-email
// res.status(200).json({ message: 'Suscriptor registrado con éxito' });
// res.status(500).json({ error: 'Error al registrar suscriptor' });


app.post('/sub-email', (req, res) => {
  const { subemail } = req.body; // Obtener el valor del campo 'subemail' del cuerpo de la solicitud
  if (!subemail) {
    const mensaje1 = 'Flaco mete un mail por favor';
    res.render('index', { mensaje1 });
  } else {
    const sql = 'SELECT * FROM subemail WHERE email = ?';
    db.query(sql, [subemail], (err, result) => {
      if (err) {
        console.error('Error al verificar usuario:', err);
        res.status(500).json({ error: 'Error al verificar usuario' });
      } else {
        if (result.length > 0) {
          const mensaje2 = 'Flaco, el correo electrónico ya está registrado';
          res.render('index', { mensaje2 });
        } else {
          const mensaje3 = 'exitoflaco';
          const insertSql = 'INSERT INTO subemail SET ?';
          db.query(insertSql, { email: subemail }, (err, result) => {
            if (err) {
              console.error('Error al registrar suscriptor:', err);
              res.status(500).json({ error: 'Error al registrar suscriptor' });
            } else {
              res.status(200).json({ message: 'Suscriptor registrado con éxito' });
            }
          });
        }
      }
    });
  }
});

app.post('/valid-email', (req, res) => {
  const { email } = req.body;
  const sql = 'SELECT * FROM accounts WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Error al verificar usuario:', err);
      res.status(500).json({ error: 'Error al verificar usuario' });
    } else {
      if (result.length > 0) {
        res.status(200).json({ valid: false });
      } else {
        res.status(200).json({ valid: true });
      }
    }
  });
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

