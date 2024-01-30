const { response } = require('express');
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response) => {
    try {
        //Comprobamos que el email no se repita
        const { email, pwd } = req.body;

        const usuarioExiste = await Usuario.findOne({ where: { email: email } });
        if (!usuarioExiste) {
                return res.status(400).json({
                ok: false,
                msg: 'Campos incorrectos',
                token: ''
            });
        }

        //Validamos contraseña
        const pwdEncrip = bcrypt.compareSync(pwd, usuarioExiste.pwd);
        
        if (!pwdEncrip) {
                return res.status(400).json({
                ok: false,
                msg: 'Campos incorrectos',
                token: ''
            });
        }

        //Generamos el token
        const token = await generarJWT(usuarioExiste.id, usuarioExiste.rol);

        res.json({
            ok: true,
            msg: 'login',
            token: token,
            idUsuario: usuarioExiste.id
        })
    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'errorLogin',
            error: error
        })
    }
}

module.exports = { login }