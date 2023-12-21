const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerProductoPromocion, crearProductoPromocion, borrarProductoPromocion, actualizarProductoPromocion } = require('../controllers/Enpromocion');

const router = Router(); //Declaramos un router de tipo Router

router.get('/enpromocion', validarJWT, obtenerProductoPromocion);

router.post('/enpromocion', [ 
    validarJWT,
    check('fecha', "La fecha está vacía").not().isEmpty(),
    check('precio', "El precio está vacío").not().isEmpty(),
    check('idPromo', "El id de la promoción está vacío").not().isEmpty(),
    check('idProd', "El id del producto está vacío").not().isEmpty(),
    validarCampos,
], crearProductoPromocion);

router.put('/enpromocion/:id', [ 
    validarJWT,
    check('fecha', "La fecha está vacía").not().isEmpty(),
    check('precio', "El precio está vacío").not().isEmpty(),
    check('idPromo', "El id de la promoción está vacío").not().isEmpty(),
    check('idProd', "El id del producto está vacío").not().isEmpty(),
    validarCampos,
], actualizarProductoPromocion);

router.delete('/enpromocion/:id', [
    validarJWT,
    validarCampos,
], borrarProductoPromocion)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo