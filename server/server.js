// server.js
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

// Configuración de Multer para determinar cómo se almacenan los archivos.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Aquí suponemos que el cliente envía "userName" y "timestamp" en el cuerpo de la solicitud
        const userName = req.body.userName;
        const timestamp = req.body.timeStamp; // si estás usando timestamps en los nombres de las carpetas
        const userDirectory = path.join('./videos/', `${userName}-${timestamp}`);
        cb(null, userDirectory);
    },
    filename: function (req, file, cb) {
        // Suponiendo que el cliente envía "action" en el cuerpo de la solicitud
        const action = req.body.action;
        cb(null, `${action}-${Date.now()}.webm`);
    }
});


const upload = multer({ dest: 'videos/temp/' });
const path = require('path');

// Ruta POST para subir los archivos
app.post('/upload', upload.single('video'), (req, res, next) => {
    console.log("empieza upload desde server");
    const file = req.file;
    const formData = JSON.parse(req.body.userInfo);
    console.log("data parseada");
    if (!file || !formData) {
        return res.status(400).send('Información de archivo o usuario no proporcionada.');
    }

    const apellido = formData.lastName.split(" ").join("-");
    const userName = formData.firstName + "-" + apellido;
    const action = path.basename(file.originalname, '.webm'); 
    const timestamp = formData.timeStamp;

    // Validación básica
    if (!userName || !action || !timestamp) {
        return res.status(400).send('Faltan datos necesarios para guardar el archivo.');
    }

    const finalPath = path.join(__dirname, 'videos', `${userName}-${timestamp}`, `${action}.webm`);

    fs.rename(file.path, finalPath, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err);
            return res.status(500).send('Error al guardar el video.');
        }
        res.send('Video guardado con éxito.');
    });
});


app.post('/create-user-directory', (req, res) => {
    const userName = req.body.userName;
    const timestamp = req.body.timeStamp;  // Aquí accedemos directamente a timeStamp

    console.log('Solicitud recibida para /create-user-directory');
    console.log('Cuerpo completo de la solicitud:', req.body);

    if (!userName || !timestamp) {  // Asegurarse que tanto userName como timestamp existen
        return res.status(400).send('Nombre de usuario o timestamp no proporcionado.');
    }

    const directory = path.join(__dirname, 'videos', `${userName}-${timestamp}`);

    console.log("Nombre del directorio:", directory);

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

app.get('/', (req, res) => {
    res.send('¡El servidor está funcionando!');
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
