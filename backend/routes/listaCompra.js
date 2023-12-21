const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerListaCompra, crearListaCompra, borrarListaCompra, actualizarListaCompra } = require('../controllers/listaCompra');

const router = Router(); //Declaramos un router de tipo Router

router.get('/listacompra', validarJWT, obtenerListaCompra);

router.post('/listacompra', [ 
    validarJWT,
    check('idUsu', "El id del usuario está vacío").not().isEmpty(),
    check('idProd', "El id del producto está vacío").not().isEmpty(),
    check('fecha', "La fecha está vacía").not().isEmpty(),
    check('cantidad', "La cantidad está vacía").not().isEmpty(),
    validarCampos,
], crearListaCompra);

router.put('/listacompra/:id', [ 
    validarJWT,
    check('idUsu', "El id del usuario está vacío").not().isEmpty(),
    check('idProd', "El id del producto está vacío").not().isEmpty(),
    check('fecha', "La fecha está vacía").not().isEmpty(),
    check('cantidad', "La cantidad está vacía").not().isEmpty(),
    validarCampos,
], actualizarListaCompra);

router.delete('/listacompra/:id', [
    validarJWT,
    validarCampos,
], borrarListaCompra)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo