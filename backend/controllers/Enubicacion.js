const { Enubicacion } = require('../models/Enubicacion');
const { Producto } = require('../models/productos');
const { Ubicacion } = require('../models/ubicaciones');

async function obtenerProductoUbicacion(req, res) {
    const id = req.query.id;
    const idUbi = req.query.idUbi;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    try {
        let prodUbi, total;
        if (id) {
            prodUbi = await Enubicacion.findOne({ where: { id: id } });
            if (!prodUbi) {
                return res.json({
                    ok: false,
                    msg: 'El id de la relación producto-ubicación debe ser válido'
                });
            }
        }
        else if(idUbi){
            prodUbi = await Enubicacion.findAll({ where: { idUbi: idUbi } });
            if (!prodUbi) {
                return res.json({
                    ok: false,
                    msg: 'El id ubicacion de la relación producto-ubicación debe ser válido'
                });
            }
        }
        else {
            [prodUbi, total] = await Promise.all([
                Enubicacion.findAll({
                    offset: desde,
                    limit: registropp,
                }),
                Enubicacion.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getProductoUbicaciones',
            prodUbi: prodUbi,
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo prducoto y sus ubicaciones',
            error: error
        });
    }
}

const crearProductoUbicacion = async(req, res) => {
    try{
        const enubicacion = req.body;

        const producto = await Producto.findOne({ where: { id: enubicacion.idProd }});
        if(!producto){
            return res.json({
                ok: false,
                msg: 'El id del producto debe ser válido'
            });
        }

        const ubicacion = await Ubicacion.findOne({ where: { id: enubicacion.idUbi }});
        if(!ubicacion){
            return res.json({
                ok: false,
                msg: 'La ubicación debe ser válida'
            });
        }
        
        const newEnubicacion = new Enubicacion({
            idProd: enubicacion.idProd,
            idUbi: enubicacion.idUbi,
            fecha_ini: enubicacion.fecha_ini,
            fecha_fin: enubicacion.fecha_fin
        });

        //Hacemos la request
        await newEnubicacion.save();

        res.json({
            ok: true,
            msg: 'crearRelacionProdUbi',
            enubicacion: newEnubicacion
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la relación producto-ubicación',
            error: error
        });
    }
}

const actualizarProductoUbicacion = async(req, res) => {
    try{
        const nuevaEnubicacion = req.body;

        //Comprobamos que el producto existe

        const nuevoProducto = await Producto.findOne({ where: {id: nuevaEnubicacion.idProd}});
        if(!nuevoProducto){
            return res.status(400).json({
                ok: false,
                msg: 'No existe este producto'
            });
        }

        //Comprobamos que la ubicación exista
        const nuevaUbicacion = await Ubicacion.findOne({ where: {id: nuevaEnubicacion.idUbi}});
        if(!nuevaUbicacion){
            return res.status(400).json({
                ok: false,
                msg: 'No existe esta ubicación'
            });
        }

        const id = req.params.id;
        const enubiModificar = await Enubicacion.findOne({ where: {id: id}});

        await enubiModificar.update({
            idProd: nuevaEnubicacion.idProd,
            idUbi: nuevaEnubicacion.idUbi,
            fecha_ini: nuevaEnubicacion.fecha_ini,
            fecha_fin: nuevaEnubicacion.fecha_fin
        });

        res.json({
            ok: true,
            msg: 'actualizarProdUbi',
            nuevaEnubicacion: enubiModificar
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando la relación producto-ubicación',
            error: error
        });
    }
}

const borrarProductoUbicacion = async(req, res) => {
    try{
        const id = req.params.id;
        const enubicacion = await Enubicacion.findOne({ where: { id: id } });
        await enubicacion.destroy();

        res.json({
            ok: true,
            msg: 'borrarProdUbi',
            enubicacion: enubicacion
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando la relación entre producto y ubicación'
        });
    }
}

module.exports = { obtenerProductoUbicacion, crearProductoUbicacion, actualizarProductoUbicacion, borrarProductoUbicacion };