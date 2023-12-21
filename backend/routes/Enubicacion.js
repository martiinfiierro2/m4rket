const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerProductoUbicacion, crearProductoUbicacion, borrarProductoUbicacion, actualizarProductoUbicacion } = require('../controllers/Enubicacion');

const router = Router(); //Declaramos un router de tipo Router

router.get('/enubicacion', validarJWT, obtenerProductoUbicacion);

router.post('/enubicacion', [ 
    validarJWT,
    check('idProd', "El id de producto está vacío").not().isEmpty(),
    check('idUbi', "El id de ubicación está vacío").not().isEmpty(),
    check('fecha_ini', "La fecha de inicio está vacía").not().isEmpty(),
    check('fecha_fin', "La fecha de fin está vacía").not().isEmpty(),
    validarCampos,
], crearProductoUbicacion);

router.put('/enubicacion/:id', [ 
    validarJWT,
    check('idProd', "El id de producto está vacío").not().isEmpty(),
    check('idUbi', "El id de ubicación está vacío").not().isEmpty(),
    check('fecha_ini', "La fecha de inicio está vacía").not().isEmpty(),
    check('fecha_fin', "La fecha de fin está vacía").not().isEmpty(),
    validarCampos,
], actualizarProductoUbicacion);

router.delete('/enubicacion/:id', [
    validarJWT,
    validarCampos,
], borrarProductoUbicacion)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo