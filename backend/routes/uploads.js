const { Router } = require('express'); //Carga un aclase Router de express

const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
const { validarJWT } = require('../middleware/validar-jwt');
const { validarCampos } = require('../middleware/validar-campos');
const { enviarArchivo, subirArchivo } = require('../controllers/uploads');

const router = Router(); //Declaramos un router de tipo Router

router.get('/uploads/:tipo/:nombrearchivo', [
    validarJWT,
    check('nombrearchivo', 'El nombre del archivo debe de ser válido').trim(),
    validarCampos,
], enviarArchivo);

router.get('/uploadsDataset/:tipo/:nombrearchivo', [
    check('nombrearchivo', 'El nombre del archivo debe de ser válido').trim(),
    validarCampos,
], enviarArchivo);

router.post('/uploads/:tipo/:id', [
    validarJWT,
    validarCampos,
], subirArchivo);

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo