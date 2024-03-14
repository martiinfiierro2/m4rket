const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerUbicacion, crearUbicacion, actualizarUbicacion, borrarUbicacion } = require('../controllers/ubicaciones');

const router = Router(); //Declaramos un router de tipo Router

router.get('/ubicaciones', validarJWT, obtenerUbicacion);

router.post('/ubicaciones', [
    validarJWT,
    check('referencia', "La referencia está vacía").not().isEmpty(),
    check('posicion', "La posicion está vacía").not().isEmpty(),
    validarCampos,
], crearUbicacion);

router.put('/ubicaciones/:id', [
    validarJWT,
    check('referencia', "La referencia está vacía").not().isEmpty(),
    check('posicion', "La posicion está vacía").not().isEmpty(),
    validarCampos,
], actualizarUbicacion);

router.delete('/ubicaciones/:id', [
    validarJWT,
    validarCampos
], borrarUbicacion)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo