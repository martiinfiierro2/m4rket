const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const { obtenerTipoPromocion, crearTipoPromocion, actualizarTipoPromocion, borrarTipoPromocion } = require('../controllers/tipoPromo');

const router = Router(); //Declaramos un router de tipo Router

router.get('/tipopromo', validarJWT, obtenerTipoPromocion);

router.post('/tipopromo', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('descripcion', "La descripción está vacía").not().isEmpty(),
    check('modificador', "El modificador esta vacío").not().isEmpty(),
    validarCampos,
], crearTipoPromocion);

router.put('/tipopromo/:id', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('descripcion', "La descripción está vacía").not().isEmpty(),
    check('modificador', "El modificador esta vacío").not().isEmpty(),
    validarCampos,
], actualizarTipoPromocion);

router.delete('/tipopromo/:id', [
    validarJWT,
    validarCampos,
], borrarTipoPromocion);

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo