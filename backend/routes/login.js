const { Router } = require('express'); //Carga un aclase Router de express
const { check } = require('express-validator'); //Permite hacer validacions de campos en las request
                                                //Check permite validar todo (Hay modulos para partes concretas)
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');
const { login, token } = require('../controllers/login');

const router = Router();

router.get('/token', [
    check('x-token', 'El token(x-token) es obligatorio').not().isEmpty(),
    validarCampos,
], token);

router.post('/login', [
    check('email', 'El campo email es obligatorio').not().isEmpty(),
    check('pwd', 'El campo contraseña es obligatorio').not().isEmpty(),
    validarCampos,
], login);

module.exports = router;
