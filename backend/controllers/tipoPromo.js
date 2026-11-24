const { tipopromo } = require('../models/tipoPromo');

const obtenerTipoPromocion = async(req, res) => {

    //Obtenemos el ID por si quiere buscar por id
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    try{
        let tipopromociones, total;
        if(id){
            tipopromociones = await tipopromo.findOne({ where: { id: id } });
            if(!tipopromociones){
                return res.json({
                    ok: false,
                    msg: 'El id de la promoción debe ser válido'
                });
            }
        }
        else{
            //Promise.All ejecuta todas las peticiones a la vez
            [tipopromociones, total] = await Promise.all([
                tipopromo.findAll({
                    offset: desde,
                    limit: registropp
                }),
                //Total de usuarios que hay en la base de datos
                tipopromo.count()
            ]);
        }

        res.json({
            ok: true,
            msg: 'getTipoPromocion',
            tipopromociones: tipopromociones,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo el tipo de promoción',
            error: error
        });
    }
};

const crearTipoPromocion = async(req, res) => {
    try{
        const { nombre } = req.body;

        const nombretipopromo = await tipopromo.findOne({ where: { nombre: nombre }});
        if(nombretipopromo){
            return res.json({
                ok: false,
                msg: 'Ya existe una promoción con ese nombre'
            });
        }
        const tipopromocion = new tipopromo(req.body);
        await tipopromocion.save();

        res.json({
            ok: true,
            msg: 'crearTipoPromoción',
            tipopromocion: tipopromocion
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error creando el tipo de promoción'
        });
    }
}

const actualizarTipoPromocion = async(req, res) => {
    try{
        const id = req.params.id;
        const { nombre, descripcion, modificador } = req.body;


        const tipopromocion = await tipopromo.findOne({ where: {nombre: nombre}});
        if(tipopromocion && tipopromocion.id !== Number(id)){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un tipo de promoción con ese nombre'
            });
        }

        const nuevaPromocion = await tipopromo.findByPk(id);

        await nuevaPromocion.update({
            nombre: nombre,
            descripcion: descripcion,
            modificador: modificador
        });

        res.json({
            ok: true,
            msg: 'actualizarTipoPromoción',
            tipopromocion: nuevaPromocion
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando el tipo de promoción'
        });
    }
}

const borrarTipoPromocion = async(req, res) => {
    try{
        const id = req.params.id;
        const usuario = await tipopromo.findByPk(id);
        await usuario.destroy();

        res.json({
            ok: true,
            msg: 'borrarTipoPromocion',
            usuario: usuario
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando el tipo de promoción'
        });
    }
}

module.exports = { obtenerTipoPromocion, crearTipoPromocion, actualizarTipoPromocion, borrarTipoPromocion };