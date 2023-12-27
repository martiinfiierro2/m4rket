const { Router } = require('express'); //Carga un aclase Router de express

const { validarJWT } = require('../middleware/validar-jwt');
const { enviarArchivo, subirArchivo } = require('../controllers/uploads');

const router = Router(); //Declaramos un router de tipo Router

router.get('/uploads/:tipo/:id', validarJWT, enviarArchivo);

router.post('/uploads/:tipo/:id', [
    validarJWT,
], subirArchivo);

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo