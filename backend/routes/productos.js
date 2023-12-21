const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerProducto, crearProducto, actualizarProducto, borrarProducto } = require('../controllers/productos');

const router = Router(); //Declaramos un router de tipo Router

router.get('/productos', validarJWT, obtenerProducto);

router.post('/productos', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('marca', "La marca está vacía").not().isEmpty(),
    check('categoria', "La categoría está vacía").not().isEmpty(),
    check('stock', "El stock está vacío").not().isEmpty(),
    check('precio', "El precio está vacía").not().isEmpty(),
    validarCampos,
], crearProducto);

router.put('/productos/:id', [
    validarJWT,
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('marca', "La marca está vacía").not().isEmpty(),
    check('categoria', "La categoría está vacía").not().isEmpty(),
    check('stock', "El stock está vacío").not().isEmpty(),
    check('precio', "El precio está vacía").not().isEmpty(),
    validarCampos,
], actualizarProducto);

router.delete('/productos/:id', [
    validarJWT,
    validarCampos
], borrarProducto)

module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo