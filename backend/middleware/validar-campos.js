//Lo que hace es devolver, los errores si los hay, sin tener que escribirlo en cada controller
//Se invoca en el router como función exportada y pasa al controller con las validaciones hechas
//y los errores los muestra en el return
const { response } = require('express');
const { validationResult } = require('express-validator');

const validarCampos = (req, res = response, next) => {
    const erroresVal = validationResult(req);
    if (!erroresVal.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errores: erroresVal.mapped()
        });
    }
    next();
}
module.exports = { validarCampos }