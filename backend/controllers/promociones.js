const bcrypt = require('bcryptjs'); //Para cifrar contraseñas
const { tipopromo } = require('../models/tipoPromo');
const  { Promocion } = require('../models/promociones');

const obtenerPromociones = async(req, res) => {

    //Obtenemos el ID del usuario por si solo quiere buscar por usuario
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 4;

    try{
        let promociones, total;
        if(id){
            promociones = await Promocion.findOne({ where: { id: id }});
            if(!promociones){
                return res.json({
                    ok: false,
                    msg: 'El id de la promoción debe ser válido'
                });
            }
        }
        else{
            [promociones, total] = await Promise.all([
                Promocion.findAll({
                    offset: desde,
                    limit: registropp,
                    include: [tipopromo]
                }),
                //Total de usuarios que hay en la base de datos
                Promocion.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getPromociones',
            promociones: promociones,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo promociones',
            error: error
        });
    }
};

const crearPromocion = async(req, res) => {
    try{
        const { id_tipoPromo } = req.body;

        const tipopromocion = await tipopromo.findOne({ where: { id: id_tipoPromo }});

        const newPromo = new Promocion({
            nombre: req.body.nombre,
            fecha_ini: req.body.fecha_ini,
            fecha_fin: req.body.fecha_fin,
            id_tipoPromo: req.body.id_tipoPromo
        });

        await newPromo.save();

        res.json({
            ok: true,
            msg: 'crearPromoción',
            promocion: newPromo
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la promoción'
        });
    }
}

const actualizarPromocion = async(req,res) => {
    try{
        const id = req.params.id;
        const { nombre, id_tipoPromo } = req.body;

        //Comprobar nombre
        const promo = await Promocion.findOne({ where: {nombre: nombre}});
        if(promo){
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe esta promoción'
            });
        }

        //Comprobar tipo promo
        const tipopromocion = await tipopromo.findOne({ where: { id: id_tipoPromo }});
        if(!tipopromocion){
            return res.status(400).json({
                ok: false,
                msg: 'Este tipo de promocion no existe'
            });
        }
        

        //Update
        const actualizarPromo = await Promocion.findByPk(id);
        await actualizarPromo.update({
            nombre: req.body.nombre,
            fecha_ini: req.body.fecha_ini,
            fecha_fin: req.body.fecha_fin,
            id_tipoPromo: req.body.id_tipoPromo
        });
        
        res.json({
            ok: true,
            msg: 'actualizarPromocion',
            promocion: actualizarPromo
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando la promocion',
            error: error
        });
    }
}

const borrarPromocion = async(req, res) => {
    try{
        const id = req.params.id;
        const promocion = await Promocion.findByPk(id);
        await promocion.destroy();

        res.json({
            ok: true,
            msg: 'borrarPromocion',
            promocion: promocion
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando el promocion'
        });
    }
}

module.exports = { obtenerPromociones, crearPromocion, actualizarPromocion, borrarPromocion };