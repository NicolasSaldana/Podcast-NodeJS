const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors')
const path = require('path')
require('dotenv').config();


const app = express();
const port = 3000

app.use("/assets", express.static(path.join(__dirname, "/assets")))
app.set('views', path.join(__dirname, "/views"))
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(__dirname + 'href="/css/style.css">'));

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

app.get('/', (req, res) => {
  return res.render('index.ejs');
});


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

app.post("/subemail", (req, res) => {
  const { subemail } = req.body;

  if (!subemail) {
    console.log('El correo electrónico no puede estar vacío');
    return res.status(400).json({ error: "El correo electrónico no puede estar vacío" });
  }

  if (subemail.charAt(0) === "@") {
    console.log('El primer carácter no puede ser "@"');
    return res.status(400).json({ error: "El primer carácter no puede ser '@'" });
  }

  const selectSql = 'SELECT COUNT(*) AS count FROM subemail WHERE subemail = ?';
  const selectValues = [subemail];

  // const sql = 'INSERT INTO subemail (subemail) VALUES (?)';
  // const values = [subemail];

  // db.query(sql, values, (err, result) => {
  //   if (err) {
  //     console.error('Error al guardar el correo electrónico en la base de datos:', err);
  //     return res.status(500).json({ error: 'Error al guardar el correo electrónico en la base de datos' });
  //   }
  //   console.log('Correo electrónico guardado en la base de datos:', subemail);
  //   return res.status(200).json({ message: 'Correo electrónico guardado correctamente' });
  // });
  
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

