const { Listacompra } = require('../models/listaCompra');
const { Producto } = require('../models/productos');
const { Usuario } = require('../models/usuarios');

async function obtenerListaCompra(req, res) {
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    try {
        let listacompra, total;
        if (id) {
            listacompra = await Listacompra.findAll({ where: { idUsu: id } });
            if (!listacompra) {
                return res.json({
                    ok: false,
                    msg: 'El id de la lista de la compra debe ser válido'
                });
            }
        }
        else {
            [listacompra, total] = await Promise.all([
                Listacompra.findAll({
                    offset: desde,
                    limit: registropp,
                }),
                Listacompra.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getListaCompraes',
            listacompra: listacompra, 
            page: {
                desde,
                registropp,
                total
            }
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo la lista de la compra',
            error: error
        });
    }
}

const crearListaCompra = async(req, res) => {
    try{
        const listacompra = req.body;

        const producto = await Producto.findOne({ where: { id: listacompra.idProd }});
        if(!producto){
            return res.json({
                ok: false,
                msg: 'El id del producto debe ser válido'
            });
        }

        const usuario = await Usuario.findOne({ where: { id: listacompra.idUsu }});
        if(!usuario){
            return res.json({
                ok: false,
                msg: 'El usuario debe ser válido'
            });
        }
        
        const newListacompra = new Listacompra({
            idUsu: listacompra.idUsu,
            idProd: listacompra.idProd,
            fecha: listacompra.fecha,
            cantidad: listacompra.cantidad
        });

        //Hacemos la request
        await newListacompra.save();

        res.json({
            ok: true,
            msg: 'crearListaCompra',
            listacompra: newListacompra
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error creando la lista de la compra',
            error: error
        });
    }
}

const actualizarListaCompra = async(req, res) => {
    try{
        const nuevaListacompra = req.body;

        //Comprobamos que el producto existe
        const nuevoProducto = await Producto.findOne({ where: {id: nuevaListacompra.idProd}});
        if(!nuevoProducto){
            return res.status(400).json({
                ok: false,
                msg: 'No existe este producto'
            });
        }

        //Comprobamos que el usuario exista
        const nuevoUsuario = await Usuario.findOne({ where: {id: nuevaListacompra.idUsu}});
        if(!nuevoUsuario){
            return res.status(400).json({
                ok: false,
                msg: 'No existe este usuario'
            });
        }

        const id = req.params.id;
        const listaModificar = await Listacompra.findOne({ where: {id: id}});

        await listaModificar.update({
            idUsu: nuevaListacompra.idUsu,
            idProd: nuevaListacompra.idProd,
            fecha: nuevaListacompra.fecha,
            cantidad: nuevaListacompra.cantidad
        });

        res.json({
            ok: true,
            msg: 'actualizarListaCompra',
            listacompra: nuevaListacompra
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando la lista de la compra',
            error: error
        });
    }
}

const borrarListaCompra = async(req, res) => {
    try{
        const id = req.params.id;
        const listacompra = await Listacompra.findOne({ where: { id: id } });
        await listacompra.destroy();

        res.json({
            ok: true,
            msg: 'borrarListaCompra',
            listacompra: listacompra
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando la lista de la compra'
        });
    }
}

module.exports = { obtenerListaCompra, crearListaCompra, actualizarListaCompra, borrarListaCompra };