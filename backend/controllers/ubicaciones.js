const { Ubicacion } = require('../models/ubicaciones');


const obtenerUbicacion = async(req, res) => {
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 4;

    try{
        let ubicaciones, total;
        if(id){
            ubicaciones = await Ubicacion.findOne({ where: { id: id }});
            if(!ubicaciones){
                return res.json({
                    ok: false,
                    msg: 'El id de la ubicacion debe ser válido'
                });
            }
        }
        else{
            [ubicaciones, total] = await Promise.all([
                Ubicacion.findAll({
                    offset: desde,
                    limit: registropp
                }),
                Ubicacion.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getUbicaciones',
            ubicaciones: ubicaciones,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo ubicaciones',
            error: error
        });
    }
};

const crearUbicacion = async(req, res) => {
    try{

        const { referencia } = req.body;

        const exiteReferencia = await Ubicacion.findOne({ where: { referencia: referencia } });
            if (exiteReferencia) {
                return res.status(400).json({
                ok: false,
                msg: 'Referencia ya existe'
            });
        }

        const ubicacion = new Ubicacion(req.body);

        await ubicacion.save();
        res.json({
            ok: true,
            msg: 'crearUbicaciones',
            ubicacion: ubicacion
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la ubicacion',
            error: error
        });
    }
}

const actualizarUbicacion = async(req,res) => {
    try{
        const id = req.params.id;
        const { referencia } = req.body;
        console.log(referencia);

        const exiteReferencia = await Ubicacion.findOne({ where: { referencia: referencia } });
            if (exiteReferencia) {
                return res.status(400).json({
                ok: false,
                msg: 'Referencia ya existe'
            });
        }

        const ubicacion = await Ubicacion.findByPk(id);

        await ubicacion.update( {
            referencia: referencia
        });
        
        res.json({
            ok: true,
            msg: 'actualizarUbicacion',
            ubicacion: ubicacion
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando la ubicacion',
            error: error
        });
    }
}

const borrarUbicacion = async(req, res) => {
    try{
        const id = req.params.id;
        const ubicacion = await Ubicacion.findByPk(id);
        await ubicacion.destroy();

        res.json({
            ok: true,
            msg: 'borrarUbicacion',
            ubicacion: ubicacion
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando la ubicacion'
        });
    }
}

module.exports = { obtenerUbicacion, crearUbicacion, actualizarUbicacion, borrarUbicacion };