const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const { obtenerPromociones, crearPromocion, actualizarPromocion, borrarPromocion } = require('../controllers/promociones');

const router = Router(); //Declaramos un router de tipo Router

router.get('/promociones', validarJWT, obtenerPromociones);

router.post('/promociones', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('fecha_ini', "La fecha de inicio está vacía").not().isEmpty(),
    check('fecha_fin', "La fecha de fin está vacía").not().isEmpty(),
    validarCampos,
], crearPromocion);

router.put('/promociones/:id', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('fecha_ini', "La fecha de inicio está vacía").not().isEmpty(),
    check('fecha_fin', "La fecha de fin está vacía").not().isEmpty(),
    validarCampos,
], actualizarPromocion);

router.delete('/promociones/:id', validarJWT, borrarPromocion);



module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo