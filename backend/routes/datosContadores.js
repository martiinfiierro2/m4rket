const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerDatosContadores, crearDatosContadores, borrarDatosContadores } = require('../controllers/datosContadores');

const router = Router(); //Declaramos un router de tipo Router

router.get('/contadores', validarJWT, obtenerDatosContadores);

router.post('/contadores', [ 
    validarJWT,
    check('nombre', "El nombre de la estadística está vacío").not().isEmpty(),
    validarCampos,
], crearDatosContadores);

router.delete('/contadores/:id', [
    validarJWT,
    validarCampos,
], borrarDatosContadores);

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo