const bcrypt = require('bcryptjs'); //Para cifrar contraseñas
const { Usuario, serializeUsuario, serializarListaUsuarios } = require('../models/usuarios');

const obtenerUsuarios = async(req, res) => {

    //Obtenemos el ID del usuario por si solo quiere buscar por usuario
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 4;

    try{
        let usuarios, usuario2, total;
        if(id){
            usuarios = await Usuario.findOne({ where: { id: id } });
            if(!usuarios){
                return res.json({
                    ok: false,
                    msg: 'El id de usuario debe ser válido'
                });
            }
            usuario2 = serializeUsuario(usuarios);
        }
        else{
            //Promise.All ejecuta todas las peticiones a la vez
            const [usuarios, total] = await Promise.all([
                Usuario.findAll({
                    offset: desde,
                    limit: registropp
                }),
                //Total de usuarios que hay en la base de datos
                Usuario.count()
            ]);
            usuario2 = serializarListaUsuarios(usuarios);
        }

        res.json({
            ok: true,
            msg: 'getUsuarios',
            usuarios: usuario2,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo usuarios',
            error: error
        });
    }
};

const crearUsuarios = async (req, res) => {
    try{
        //Comprobamos que el email no se repita
        const { email, pwd } = req.body;

        const exiteEmail = await Usuario.findOne({ where: { email: email } });
            if (exiteEmail) {
                return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        //Ciframos la contraseña
        const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
        password = bcrypt.hashSync(pwd, salt); // y aquí ciframos la contraseña

        //Creamos el usuario
        const usuario = new Usuario(req.body);
        usuario.pwd = password; //Asignamos contraseña cifrada

        //Hacemos la request
        await usuario.save();
        res.json({
            ok: true,
            msg: 'crearUsuarios',
            usuario: usuario
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error creando al usuario',
            error: error
        });
    }
};

const actualizarUsuario = async(req, res) => {
    try{
        const id = req.params.id;
        const { email, nombre, apellido, genero, pwd, rol } = req.body;

        //Comprobamos que el email no se repita
        const exiteEmail = await Usuario.findOne({ where: { email: email } });
            if (exiteEmail) {
                return res.status(400).json({
                ok: false,
                msg: 'Email ya existe'
            });
        }

        //Ciframos la contraseña
        const salt = bcrypt.genSaltSync(); // generamos un salt, una cadena aleatoria
        password = bcrypt.hashSync(pwd, salt); // y aquí ciframos la contraseña

        const usuario = await Usuario.findByPk(id);

        await usuario.update( {
            id: id,
            nombre: nombre, 
            apellido: apellido, 
            email: email, 
            pwd: password,
            genero: genero,
            rol: rol
        });
        
        res.json({
            ok: true,
            msg: 'actualizarUsuario',
            usuario: usuario
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando el usuario',
            error: error
        });
    }
}

const borrarUsuario = async(req, res) => {
    try{
        const idUsuario = req.params.id;
        const usuario = await Usuario.findByPk(idUsuario);
        await usuario.destroy();

        res.json({
            ok: true,
            msg: 'borrarUsuario',
            usuario: usuario
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando el usuario'
        });
    }
}

module.exports = { obtenerUsuarios, crearUsuarios, actualizarUsuario, borrarUsuario };