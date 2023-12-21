const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { login } = require('../controllers/login');

const router = Router();

router.post('/login', [
    check('email', 'El campo email es obligatorio').not().isEmpty(),
    check('pwd', 'El campo contraseña es obligatorio').not().isEmpty(),
    validarCampos,
], login);

module.exports = router;
