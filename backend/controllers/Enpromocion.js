const { Enpromocion } = require('../models/Enpromocion');
const { Producto } = require('../models/productos');
const { Promocion } = require('../models/promociones');

async function obtenerProductoPromocion(req, res) {
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    try {
        let prodPromo, total;
        if (id) {
            prodPromo = await Enpromocion.findOne({ where: { id: id } });
            if (!prodUbi) {
                return res.json({
                    ok: false,
                    msg: 'El id de la relación producto-promoción debe ser válido'
                });
            }
        }
        else {
            [prodPromo, total] = await Promise.all([
                Enpromocion.findAll({
                    offset: desde,
                    limit: registropp,
                }),
                Enpromocion.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getProductoPromocion',
            prodPromo: prodPromo,
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error obteniendo prducoto y su promoción',
            error: error
        });
    }
}

const crearProductoPromocion = async(req, res) => {
    try{
        const enpromocion = req.body;

        //Comprobamos que existe el producto
        const producto = await Producto.findOne({ where: { id: enpromocion.idProd }});
        if(!producto){
            return res.json({
                ok: false,
                msg: 'El id del producto debe ser válido'
            });
        }

        //Comprobamos la promoción
        const promocion = await Promocion.findOne({ where: { id: enpromocion.idPromo }});
        if(!promocion){
            return res.json({
                ok: false,
                msg: 'La promocion debe ser válida'
            });
        }
        
        //Creamos la nueva relación producto-promoción
        const newEnpromocion = new Enpromocion({
            fecha: enpromocion.fecha,
            precio: enpromocion.precio,
            idPromo: enpromocion.idPromo,
            idProd: enpromocion.idProd
        });

        //Hacemos la request
        await newEnpromocion.save();

        res.json({
            ok: true,
            msg: 'crearProductoPromocion',
            enpromocion: newEnpromocion
        });
    }catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error creando la relación producto-promoción',
            error: error
        });
    }
}

const actualizarProductoPromocion = async(req, res) => {
    try{
        const nuevaEnpromocion = req.body;

        //Comprobamos que el producto existe
        const nuevoProducto = await Producto.findOne({ where: {id: nuevaEnpromocion.idProd }});
        if(!nuevoProducto){
            return res.status(400).json({
                ok: false,
                msg: 'No existe este producto'
            });
        }

        //Comprobamos que la promcion exista
        const nuevaPromocion = await Promocion.findOne({ where: {id: nuevaEnpromocion.idPromo }});
        if(!nuevaPromocion){
            return res.status(400).json({
                ok: false,
                msg: 'No existe esta promoción'
            });
        }

        //Selecionamos la relación a modificar
        const id = req.params.id;
        const enpromoModificar = await Enpromocion.findOne({ where: {id: id}});
        //La modificamos
        await enpromoModificar.update({
            fecha: nuevaEnpromocion.fecha,
            precio: nuevaEnpromocion.precio,
            idPromo: nuevaEnpromocion.idPromo,
            idProd: nuevaEnpromocion.idProd
        });

        res.json({
            ok: true,
            msg: 'actualizarProductoPromocion',
            enpromocion: enpromoModificar
        });
    }catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Error actualizando la relación producto-promoción',
            error: error
        });
    }
}

const borrarProductoPromocion = async(req, res) => {
    try{
        const id = req.params.id;
        const enpromocion = await Enpromocion.findOne({ where: { id: id } });
        await enpromocion.destroy();

        res.json({
            ok: true,
            msg: 'borrarProductoPromocion',
            enpromocion: enpromocion
        });
    }catch (error){
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Error borrando la relación entre producto y promoción'
        });
    }
}

module.exports = { obtenerProductoPromocion, crearProductoPromocion, actualizarProductoPromocion, borrarProductoPromocion };