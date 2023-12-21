const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarRol } = require('../middleware/validar-roles');
const { validarJWT } = require('../middleware/validar-jwt');
const { obtenerUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');

const router = Router(); //Declaramos un router de tipo Router

router.get('/usuarios', validarJWT, obtenerUsuarios);

router.post('/usuarios', [
    validarJWT,
    check('email', "El email está vacío").not().isEmpty(),
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('apellido', "El apellido está vacío").not().isEmpty(),
    check('genero', "El genero está vacío").not().isEmpty(),
    check('pwd', "La contraseña está vacía").not().isEmpty(),
    validarCampos,
    validarRol,
], crearUsuarios);

router.put('/usuarios/:id', [
    validarJWT,
    check('email', "El email está vacío").not().isEmpty(),
    check('nombre', "El nombre está vacío").not().isEmpty(),
    check('apellido', "El apellido está vacío").not().isEmpty(),
    check('genero', "El genero está vacío").not().isEmpty(),
    check('pwd', "La contraseña está vacía").not().isEmpty(),
    validarCampos,
    validarRol,
], actualizarUsuario);

router.delete('/usuarios/:id', [
    validarJWT,
    validarCampos
], borrarUsuario)



module.exports = router; // Exportamos el objeto router para que se pueda usar fuera del modulo