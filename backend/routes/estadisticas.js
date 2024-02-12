const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerEstadisticas, crearEstadisticas, borrarEstadisticas, actualizarEstadisticas } = require('../controllers/estadisticas');

const router = Router(); //Declaramos un router de tipo Router

router.get('/estadisticas', validarJWT, obtenerEstadisticas);

router.post('/estadisticas', [ 
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('fecha', "La fecha está vacía").not().isEmpty(),
    validarCampos,
], crearEstadisticas);

router.put('/estadisticas/:id', [ 
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('fecha', "La fecha está vacía").not().isEmpty(),
    validarCampos,
], actualizarEstadisticas);

router.delete('/estadisticas/:id', [
    validarJWT,
    validarCampos,
], borrarEstadisticas)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo