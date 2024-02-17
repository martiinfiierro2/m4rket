const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerDatosTiempo, crearDatosTiempo, borrarDatosTiempo } = require('../controllers/datosTiempo');

const router = Router(); //Declaramos un router de tipo Router

router.get('/tiempos', validarJWT, obtenerDatosTiempo);

router.post('/tiempos', [ 
    validarJWT,
    check('nombre', "El nombre de la estadística está vacío").not().isEmpty(),
    check('fecha_ini', "La fecha de inicio está vacía").not().isEmpty(),
    check('fecha_fin', "La fecha de fin está vacía").not().isEmpty(),
    validarCampos,
], crearDatosTiempo);

router.delete('/tiempos/:id', [
    validarJWT,
    validarCampos,
], borrarDatosTiempo);

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo