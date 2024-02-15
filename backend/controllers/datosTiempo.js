const { DatosTiempo} = require('../models/datosTiempo');
const { Listacompra } = require('../models/listaCompra');
const { Usuario } = require('../models/usuarios');

async function obtenerDatosTiempo(req, res) {
    const nombre = req.query.nombre;

    try {
        let datosTiempo, total;
        datosTiempo = await DatosTiempo.findAll({ where: { nombre: nombre } });
        if (!datosTiempo) {
            return res.json({
                ok: false,
                msg: 'El nombre de los datos debe ser válido'
            });
        }
        
        res.json({
            ok: true,
            msg: 'getDatosTiempo',
            datosTiempo: datosTiempo,
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo los datos',
            error: error
        });
    }
}

const crearDatosTiempo = async(req, res) => {
    try{
        if(req.body.idUsu){
            const usuario = await Usuario.findOne({ where: { id: req.body.idUsu }});
            if(!usuario){
                return res.json({
                    ok: false,
                    msg: 'El id del usuario debe ser válido'
                });
            }
        }

        if(req.body.idLista){
            const lista = await Listacompra.findOne({ where: { id: req.body.idLista }});
            if(!lista){
                return res.json({
                    ok: false,
                    msg: 'El id de la lista debe ser válido'
                });
            }
        }

        const datosTiempo = new DatosTiempo(req.body);
        await datosTiempo.save();

        res.json({
            ok: true,
            msg: 'crearDatosTiempo',
            datos: datosTiempo
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error añdiendo datos a la estadística'
        });
    }
}

const borrarDatosTiempo= async(req, res) => {
    try{
        const id = req.params.id;
        const datosTiempo = await DatosTiempo.findOne({ where: { id: id } });
        await datosTiempo.destroy();

        res.json({
            ok: true,
            msg: 'borrarDatosTiempo',
            datosTiempo: datosTiempo
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando los datos'
        });
    }
}

module.exports = { obtenerDatosTiempo, crearDatosTiempo, borrarDatosTiempo };