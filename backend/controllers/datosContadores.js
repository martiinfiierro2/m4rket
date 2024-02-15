const { DatosContadores} = require('../models/datosContadores');
const { Producto } = require('../models/productos');

async function obtenerDatosContadores(req, res) {
    const nombre = req.query.nombre; //?nombre=nombre_estadistica

    try {
        let datosContadores, total;
        datosContadores = await DatosContadores.findAll({ where: { nombre: nombre } });
        if (!datosContadores) {
            return res.json({
                ok: false,
                msg: 'El nombre de los datos debe ser válido'
            });
        }
        
        res.json({
            ok: true,
            msg: 'getDatosContadores',
            datosContadores: datosContadores,
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo los datos',
            error: error
        });
    }
}

const crearDatosContadores = async(req, res) => {
    try{
        if(req.body.idProd){
            const producto = await Producto.findOne({ where: { id: req.body.idProd }});
            if(!producto){
                return res.json({
                    ok: false,
                    msg: 'El id del producto debe ser válido'
                });
            }
        }

        const datosContador = new DatosContadores(req.body);
        await datosContador.save();

        res.json({
            ok: true,
            msg: 'crearDatosContadores',
            datos: datosContador
        });

    }catch(error){
        return res.status(400).json({
            ok: false,
            msg: 'Error añdiendo datos a la estadística'
        });
    }
}

const borrarDatosContadores= async(req, res) => {
    try{
        const id = req.params.id;
        const datosContador = await DatosContadores.findOne({ where: { id: id } });
        await datosContador.destroy();

        res.json({
            ok: true,
            msg: 'borrarDatosContador',
            datosContador: datosContador
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando los datos'
        });
    }
}

module.exports = { obtenerDatosContadores, crearDatosContadores, borrarDatosContadores };