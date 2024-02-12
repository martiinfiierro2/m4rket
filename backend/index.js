/*
Importación de módulos
*/
const express = require('express');
// Crear una aplicación de express
const cors = require('cors');
const logger = require('morgan');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const https = require('https'); 

require('dotenv').config()

const app = express();

// Declaramos los middleware
app.use(logger('dev')); // Para ver las respuestas de peticiones en la terminal
app.use(express.json()); // Contruye las request como si fuera JSON y detecta fallos de estructura (Fallos ortográficos en las request)
                         // Y permite acceder a elementos del body: req.body.'campo de la request'
app.use(cors()); // Se introduce la cabecera CORS

app.use(fileUpload({
    limits: { fileSize: process.env.MAXSIZEUPLOAD * 1024 * 1024 },
    abortOnLimit: true,
    createParentPath: true,
}));

//Estadisticas

app.use('/api', require('./routes/estadisticas'));

//Usuarios
app.use('/api', require('./routes/usuarios'));
app.use('/api', require('./routes/login'));

//Productos
app.use('/api', require('./routes/productos'));

//Ubicaciones
app.use('/api', require('./routes/ubicaciones'));
app.use('/api', require('./routes/Enubicacion'));

//Promociones
app.use('/api', require('./routes/tipoPromo'));
app.use('/api', require('./routes/promociones'));
app.use('/api', require('./routes/Enpromocion'));

//Lista compra
app.use('/api', require('./routes/listaCompra'));

//Archivos
app.use('/api', require('./routes/uploads'));

// Abrir la aplicacíon en el puerto 3030
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ', process.env.PORT);
});