// server.js
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3001;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;







app.use(bodyParser.json());
// Configurar CORS para permitir todos los orígenes (para desarrollo, ajustar para producción)
app.use(cors({
    origin: '*', // Reemplaza con tu dominio de producción para mayor seguridad
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para manejar solicitudes preflight
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});



function generateHash(name) {
    return crypto.createHash('sha256').update(name).digest('hex');
  }

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
        cb(null, `${action}-${Date.now()}.mp4`);
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
    const timestamp = formData.timeStamp;
    const hashForDir = generateHash(userName, timestamp);
    const action = path.basename(file.originalname, '.mp4'); 

    // Validación básica
    if (!userName || !action || !timestamp) {
        return res.status(400).send('Faltan datos necesarios para guardar el archivo.');
    }

    const finalPath = path.join(__dirname, 'videos', `${hashForDir}`, `${action}.mp4`);

    fs.rename(file.path, finalPath, (err) => {
        if (err) {
            console.error('Error al mover el archivo:', err);
            return res.status(500).send('Error al guardar el video.');
        }
        res.send('Video guardado con éxito.');
    });
});


const csvWriter = createCsvWriter({
    path: 'datos.csv',
    header: [
        {id: 'firstName', title: 'First Name'},
        {id: 'lastName', title: 'Last Name'},
        {id: 'age', title: 'Age'},
        {id: 'gender', title: 'Gender'},
        {id: 'underlyingCondition', title: 'Underlying Condition'},
        {id: 'estimatedWeight', title: 'Estimated Weight'},
        {id: 'height', title: 'Height'},
        {id: 'timeStamp', title: 'Timestamp'},
        {id: 'directoryHash', title: 'Directory Hash'} 
    ]
});


app.post('/submit-form', (req, res) => {
    const formData = req.body;

    if (formData.timeStamp) {
        // Asegúrate de que timeStamp es un número antes de convertirlo
        const date = new Date(parseInt(formData.timeStamp));
        // Formato ejemplo: "DD/MM/YYYY HH:mm:ss"
        const humanReadableDate = date.toLocaleString(); // Puedes ajustar el formato según necesites
        formData.timeStamp = humanReadableDate;
    }

    const userName = formData.firstName + "-" + formData.lastName;  // Asegúrate de que estos son los campos correctos
    const hashForDir = generateHash(userName, formData.timeStamp);
    formData.directoryHash = hashForDir;

    console.log('datos formulario:', req.body);
    csvWriter.writeRecords([formData])
        .then(() => {
            console.log('Data written to CSV successfully');
            res.status(200).send('Form data submitted successfully');
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Failed to write data to CSV');
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

    const hashForDir = generateHash(userName, timestamp);  
    const directory = path.join(__dirname, 'videos', `${hashForDir}`);

    console.log("Nombre del directorio:", directory);

    fs.mkdir(directory, { recursive: true }, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al crear el directorio.');
        } else {
            res.send('Directorio creado con éxito.');
        }
    });

    const originalPdfPath = path.join(__dirname, 'assets', 'consentimiento_informado.pdf');
    const newPdfName = `archivo_informado_${hashForDir}.pdf`;
    const newPdfPath = path.join(directory, newPdfName);

    fs.copyFile(originalPdfPath, newPdfPath, (err) => {
        if (err) {
            console.error('Error al copiar el archivo:', err);
            // Manejo de errores
            return;
        }
    });

});

const csv = require('csv-parser');

app.get('/search/:name', (req, res) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, 'datos.csv'))
        .pipe(csv())
        .on('data', (data) => {
            if (data['First Name'].toLowerCase().includes(req.params.name.toLowerCase()) || data['Last Name'].toLowerCase().includes(req.params.name.toLowerCase())) {
                results.push({
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    timestamp: data['Timestamp'],
                    directoryHash: data['Directory_Hash']
                });
            }
        })
        .on('end', () => {
            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).send('No entries found');
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
    console.log(`Servidor escuchando en el puerto ${port}`);
  });