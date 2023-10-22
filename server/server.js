// server.js
const express = require('express');
const multer  = require('multer');
const fs = require('fs'); // Asegúrate de que esta línea esté presente
const cors = require('cors');
const app = express();
const port = 3001; // Puedes utilizar cualquier puerto disponible

// Habilitar CORS
app.use(cors());

// Configuración de Multer para determinar cómo se almacenan los archivos.
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Reemplaza 'path/to/your/directory' con la ruta donde deseas guardar los archivos
    cb(null, './videos/');
  },
  filename: function (req, file, cb) {
    // Nombre del archivo guardado
    cb(null, file.fieldname + '-' + Date.now() + '.webm')
  }
});

const upload = multer({ storage: storage });
const path = require('path');

// Ruta POST para subir los archivos
app.post('/upload', upload.single('video'), (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error('Por favor sube un archivo');
      error.httpStatusCode = 400;
      return next(error);
    }
    res.send(file);
});

app.use(express.json()); // para manejar json en el cuerpo de la solicitud
app.use(express.urlencoded({ extended: true })); // para analizar application/x-www-form-urlencoded



app.post('/create-user-directory', (req, res) => {
    const userName = req.body.userName;
    const directory = path.join(__dirname, 'videos', userName);
  
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error al crear el directorio.');
      } else {
        res.send('Directorio creado con éxito.');
      }
    });
  });

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).send('Algo salió mal!');
  });
  

// Ruta GET de prueba, para verificar que el servidor está corriendo.
app.get('/', (req, res) => {
  res.send('¡El servidor está funcionando!');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
