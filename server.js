const express = require('express');
const session = require('express-session');
const multer = require('multer');
const cors = require('cors')
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const { error } = require('console');
require('dotenv').config();
const fs = require('fs');

const imgDefault = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
const app = express();
const port = 3000

app.use("/assets", express.static(path.join(__dirname, "/assets")))
app.set('views', path.join(__dirname, "/views"))
app.set('view engine', 'ejs');
app.use(cors());
app.use(express.static(__dirname + 'href="/css/style.css">'));
app.use("/Audios", express.static(path.join(__dirname, "/Audios")));
app.use("/ImagenesGuardadas", express.static(path.join(__dirname, "/ImagenesGuardadas")));
// app.use("/AudiosFavoritos", express.static(path.join(__dirname, "/AudiosFavoritos")));
app.use("/templates", express.static(path.join(__dirname, "/templates")));

// Configurar la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Configurar el middleware de body-parser para manejar solicitudes POST
app.use(bodyParser.urlencoded({ extended: true }));
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

//Multer  imagenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'ImagenesGuardadas/'); // Carpeta de destino para las imágenes subidas
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nombre único para cada imagen
  }
});
const upload = multer({ storage: storage });


app.get('/', (req, res) => {
  return res.render('index.ejs');
});

app.get('/configuraciones', (req, res) => {
  if (req.session.isLoggedIn === true) {
    res.sendFile(path.join(__dirname, "/templates/configuraciones.html"));
  } else {
    res.redirect('/prelogin');
  }
})

app.post('/configuraciones', upload.single('imagen'), (req, res) => {
  const imagen = req.file;
  const rutaImagen = imagen.path.replace(/\\/g, '/'); // Reemplazar todas las barras invertidas "\" por barras normales "/"

  if (req.session.user) {
    const nombre = req.session.user.nombre;
    const email = req.session.user.email;

    try {
      db.query('UPDATE cuentas SET ruta_imagen = ? WHERE email = ?', [rutaImagen, email], (error, results) => {
        if (error) {
          console.error(error);
          res.status(500).send('Error al guardar la imagen en la base de datos');
        } else {
          db.query('SELECT ruta_imagen FROM cuentas WHERE email = ?', [email], (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).send('Error al obtener la ruta de imagen de la base de datos');
            } else {

              const imagen = results[0].ruta_imagen;
              req.session.imagen = imagen;
              res.json(imagen);
            }
          });
        }
      });
      console.log("subio");
    } catch (error) {
      console.error(error);
      res.status(500).send('Error en el servidor');
    }
  } else {
    console.log('No se ha iniciado sesión');
    res.status(401).send('No se ha iniciado sesión');
  }
});

app.get('/favoritos', (req, res) => {
  if (req.session.isLoggedIn === true) {
    const email = req.session.user.email;

    const dbQuery = "SELECT ruta_audio, nombre_audio FROM favoritos2 WHERE email = ?";
    const dbValues = [email];
    
    // consulta de selección para obtener los audios guardados
    db.query(dbQuery, dbValues, (err, result) => {
      if (err) {
        console.error('Error al obtener los audios guardados:', err);
        return res.status(500).json('Error al obtener los audios guardados');
      } else {
        // Obtener las rutas y los nombres de los audios desde el resultado de la consulta
        const audioData = result.map(row => ({ ruta: row.ruta_audio, nombre: row.nombre_audio }));
        console.log("Audios guardados:", audioData);

        if (audioData.length === 0) {
          // No hay audios guardados
          return res.render('fav.ejs', { nombre: req.session.nombre, imagen: req.session.imagen, audioData });
        } else {
          const imagenPath = path.join(__dirname, req.session.imagen);

          // Verificar si la imagen existe en la carpeta
          fs.access(imagenPath, fs.constants.F_OK, (err) => {
            if (err) {
              return res.render('fav.ejs', { nombre: req.session.nombre, imagen: imgDefault,  audioData });
            } else {
              return res.render('fav.ejs', { nombre: req.session.nombre, imagen: req.session.imagen,  audioData });
            }
          });
        }
      }
    });
  } else {
    res.redirect('/prelogin');
  }
});

app.post('/favoritos', (req, res) => {
  const audioSrc = req.body.src;
  const audioName = req.body.name;

  const email = req.session.user.email;
  // console.log("Email: " + email);

  const checkQuery = "SELECT * FROM favoritos2 WHERE email = ? AND ruta_audio = ?";
  const checkValues = [email, audioSrc];

  // Verificar si el audio ya está guardado en la tabla de favoritos
  db.query(checkQuery, checkValues, (err, result) => {
    if (err) {
      console.error('Error al verificar en la tabla de favoritos:', err);
      return res.status(500).json('Error al verificar en la tabla de favoritos');
    } else if (result.length > 0) {
      console.log('El audio ya está guardado en la tabla de favoritos');
      return res.status(200).json('El audio ya está guardado en la tabla de favoritos');
    } else {
      const dbQuery = "INSERT INTO favoritos2 (email, ruta_audio , nombre_audio) VALUES (?, ?, ?)";
      const dbValues = [email, audioSrc, audioName];

      db.query(dbQuery, dbValues, (err, result) => {
        if (err) {
          console.error('Error al guardar en la tabla de favoritos:', err);
          return res.status(500).json('Error al guardar en la tabla de favoritos');
        } else {
          console.log('Archivo de audio guardado en la tabla');
          return res.status(200).json('Archivo de audio guardado exitosamente');
        }
      });
    }
  });
});

app.get('/logout', (req, res) => {
  if (req.session.isLoggedIn === true) {
    req.session.destroy();
  }
  res.redirect('/');
})

app.get('/loged', (req, res) => {
  if (req.session.isLoggedIn === true) {
    const imagenPath = path.join(__dirname, req.session.imagen);
    fs.access(imagenPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.render('home.ejs', { nombre: req.session.nombre, imagen: imgDefault });
      } else {
        return res.render('home.ejs', { nombre: req.session.nombre, imagen: req.session.imagen });
      }
    });
    // console.log(req.session);
  } else {
    res.redirect('/prelogin');
  }
})

app.get('/about', (req, res) => {
  if (req.session.isLoggedIn === true) {
    const imagenPath = path.join(__dirname, req.session.imagen);
    fs.access(imagenPath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.render('about.ejs', { nombre: req.session.nombre, imagen: imgDefault });
      } else {
        return res.render('about.ejs', { nombre: req.session.nombre, imagen: req.session.imagen });
      }
    });
    // console.log(req.session);
  } else {
    res.sendFile(path.join(__dirname, "templates/about.html"));
  }
});

app.get('/prelogin', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/login.html"));
});

app.post('/prelogin', (req, res) => {
  const { email, contraseña } = req.body;

  if (email === "" && contraseña === "") {
    console.log('Complete los campos obligatorios');
    return res.status(400).json({ message: "Complete los campos obligatorios" });
  }

  if (email === "" || contraseña === "") {
    if (email === "") {
      console.log('Complete el campo email');
      return res.status(400).json({ message: "Complete el campo email" });
    } else {
      console.log('Complete el campo contraseña');
      return res.status(400).json({ message: "Complete el campo contraseña" });
    }
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Formato del correo electrónico invalido." });
  }

  if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
    console.log('El correo electrónico no es válido');
    return res.status(400).json({ message: "Recuerda solo se permiten correos electrónicos de Gmail, Yahoo y Outlook." });
  }

  //Consulta SQL para verificar si existe el correo electrónico. Ademas obtengo el nombre del usuario y la contraseña en la consulta.
  //La variable count, NO CONFUNDIR CON EL COUNT(*), es el conteo de filas en donde coincide con el email proporcionado.  
  const checkEmailQuery = `SELECT COUNT(*) AS count, nombre, contraseña, ruta_imagen FROM cuentas WHERE email = ?`;
  const checkEmailValues = [email];

  db.query(checkEmailQuery, checkEmailValues, (err, result) => {
    if (err) {
      console.error('Error al verificar el correo electrónico: ', err);
      return res.status(500).json({ message: 'Error al verificar el correo electrónico en la base de datos.' });
    }

    const count = result[0].count;
    const storedPassword = result[0].contraseña;
    const nombre = result[0].nombre;
    let imagen = result[0].ruta_imagen;

    if (count > 0) {
      //Si existe el correo en la BD comparo las contraseñas. La hasheada en la BD con la ingresada.
      bcrypt.compare(contraseña, storedPassword, (err, isMatch) => {
        if (isMatch) {
          console.log('La contraseña es correcta');
          req.session.isLoggedIn = true;
          req.session.nombre = nombre;
          req.session.imagen = imagen;
          if (imagen === null) {
            req.session.imagen = imgDefault;
          }
          req.session.user = {
            nombre: nombre,
            email: email
          }
          console.log("login" + imagen);
          return res.redirect('/loged');

        } else {
          console.log('No es la contraseña correcta');
          return res.status(200).json({ message: 'Contraseña incorrecta' });
        }
      })
    } else {
      console.log('El correo electrónico no existe en la base de datos');
      return res.status(200).json({ message: 'El correo electrónico no existe en la base de datos' });
    }
  });

})

app.get('/preregister', (req, res) => {
  res.sendFile(path.join(__dirname, "templates/register.html"));
})


app.post('/preregister', (req, res) => {
  const { nombre, email, contraseña, rcontraseña } = req.body;

  if (nombre === "" && email === "" && contraseña === "" && rcontraseña === "") {
    console.log('Complete los campos obligatorios');
    return res.status(400).json({ message: "Complete los campos obligatorios" });
  }

  const camposIncompletos = [];

  if (nombre === "") {
    camposIncompletos.push("nombre");
  }
  if (email === "") {
    camposIncompletos.push("email");
  }
  if (contraseña === "") {
    camposIncompletos.push("contraseña");
  }
  if (rcontraseña === "") {
    camposIncompletos.push("Repetir contraseña");
  }

  if (camposIncompletos.length > 0) {
    const camposTexto = camposIncompletos.join(", ");
    if (camposIncompletos.length === 1) {
      return res.status(400).json({ message: "Complete el campo " + camposTexto + "" });
    }
    console.log('Complete los campos obligatorios');
    return res.status(400).json({ message: `Complete los campos ${camposTexto}` });
  }

  const nombreRegex = /^\.{1}|^.{0,2}$|\.+$/;
  if (nombreRegex.test(nombre)) {
    console.log("'El nombre no es valido");
    return res.status(400).json({ message: "El nombre no es válido. Debe contener al menos 3 caracteres y no puede contener caracteres '.'" });
  }

  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    console.log('El correo no es válido');
    return res.status(400).json({ message: "El correo no es válido" });
  }

  if (email.split("@")[1] !== "gmail.com" && email.split("@")[1] !== "yahoo.com" && email.split("@")[1] !== "outlook.com") {
    console.log('El correo electrónico no es válido');
    return res.status(400).json({ message: "Solo se permiten correos electrónicos de Gmail, Yahoo y Outlook." });
  }

  const contraseñaRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?!.*\s).{5,}$/;
  if (!contraseñaRegex.test(contraseña)) {
    console.log('La contraseña no es valida');
    return res.status(400).json({ message: "La contraseña no es valida. Debe contener al menos 5 caracteres, una letra mayúscula y un número." });
  }

  if (contraseña !== rcontraseña) {
    console.log('Las contraseñas no coinciden');
    // return res.status(400).json({ error: "Las contraseñas no coinciden" });
    return res.status(400).json({ message: "Las contraseñas no coinciden" });

  }


  const checkEmailQuery = `SELECT COUNT(*) AS count FROM cuentas WHERE email = ?`;
  const checkEmailValues = [email];

  db.query(checkEmailQuery, checkEmailValues, (err, result) => {
    if (err) {
      console.error('Error al verificar el correo electrónico: ', err);
      return res.status(500).json({ message: 'Error al verificar el correo electrónico en la base de datos.' });
    }

    const count = result[0].count;

    if (count > 0) {
      console.log('El correo electrónico ya existe en la base de datos:', email);
      return res.status(200).json({ message: 'El correo electrónico ya existe en la base de datos' });
    } else {

      const insertQuery = `INSERT INTO cuentas (nombre, email, contraseña, recontraseña) VALUES (?, ?, ?, ?)`;
      // const insertValues = [nombre, email, contraseña, rcontraseña];

      const saltRounds = 10;
      bcrypt.hash(contraseña, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error('Error al hashear la contraseña: ', err);
          return res.status(500).json({ message: 'Error al hashear la contraseña en la base de datos.' });
        }

        const hashedRepassword = hashedPassword; // No es necesario volver a encriptar la contraseña repetida

        const insertValues = [nombre, email, hashedPassword, hashedRepassword];

        db.query(insertQuery, insertValues, (err, result) => {
          if (err) {
            console.error('Error al guardar los datos: ', err);
            return res.status(500).json({ message: 'Error al guardar los datos en la base de datos.' });
          }
          console.log('Datos guardados correctamente en la base de datos.');
          req.session.isLoggedIn = true;
          req.session.nombre = nombre;
          req.session.imagen = imgDefault;
          req.session.user = {
            nombre: nombre,
            email: email
          }
          res.redirect('/loged');
        });
      })
    }
  });
})


app.post('/contact', (req, res) => {
  const { nombre, apellido, email, tema, mensaje } = req.body;

  if (!nombre || !email || !tema || !mensaje) {
    console.log('Complete los campos obligatorios');
    res.status(400).json({ error: "Complete los campos obligatorios" });
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

  const nombreRegex = /^[^\d\s]{3,}$/;
  if (!nombreRegex.test(nombre)) {
    console.log('El nombre no es válido');
    return res.status(400).json({ error: "El nombre no es válido. Mínimo 3 caracteres y sin números" });
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

app.post('/delete', (req, res) => {
  if (req.session.isLoggedIn === true) {
    const email = req.session.user.email;
    const audioSrc = req.body.audioSrc;


    const dbQuery = "DELETE FROM favoritos2 WHERE email = ? AND ruta_audio = ?";
    const dbValues = [email, audioSrc];

    db.query(dbQuery, dbValues, (err, result) => {
      if (err) {
        console.error('Error al eliminar el audio guardado:', err);
        return res.status(500).json('Error al eliminar el audio guardado');
      } else {
        console.log('Audio eliminado con éxito');
        return res.redirect('/favoritos');
      }
    });
  } else {
    res.redirect('/prelogin');
  }
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

