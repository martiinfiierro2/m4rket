const { Ubicacion } = require('../models/ubicaciones');


const obtenerUbicacion = async(req, res) => {
    const id = req.query.id;
    const referencia = req.query.referencia;
    const posicion = req.query.posicion;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

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
        else if(referencia && posicion){
            ubicaciones = await Ubicacion.findOne({ 
                where: {
                    referencia: referencia,
                    posicion: posicion
                }
            });
            if(!ubicaciones){
                return res.json({
                    ok: false,
                    msg: 'La referencia o la posicion de la ubicacion deben ser válidos'
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

        const { referencia, posicion } = req.body;

        const exiteReferencia = await Ubicacion.findOne({ 
            where: { 
                referencia: referencia,
                posicion: posicion
            } 
        });
        if (exiteReferencia) {
            return res.status(400).json({
                ok: false,
                msg: 'Esa referencia asignada a esa posicion ya exite'
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

        const exiteReferencia = await Ubicacion.findOne({ 
            where: { 
                referencia: referencia,
                posicion: posicion
            } 
        });
        if (exiteReferencia) {
            return res.status(400).json({
                ok: false,
                msg: 'Esa referencia asignada a esa posicion ya exite'
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