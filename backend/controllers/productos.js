const { Producto } = require('../models/productos');
const { Ubicacion } = require('../models/ubicaciones');
const { Promocion } = require('../models/promociones');
const { Op } = require('sequelize');

const obtenerProducto = async(req, res) => {
    const id = req.query.id;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    try{
        let productos, total;
        if(id){
            productos = await Producto.findOne({ 
                where: { id: id },
                include: [
                    Ubicacion,
                    Promocion,
                ]
            });
            if(!productos){
                return res.json({
                    ok: false,
                    msg: 'El id del producto debe ser válido'
                });
            }
        }
        else{
            [productos, total] = await Promise.all([
                Producto.findAll({
                    offset: desde,
                    limit: registropp,
                    include: [
                        Ubicacion,
                        Promocion,
                    ]
                }),
                //Total de usuarios que hay en la base de datos
                Producto.count()
            ]);
        }
        res.json({
            ok: true,
            msg: 'getProductos',
            productos: productos,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error obteniendo productos',
            error: error
        });
    }
};

const buscarProducto = async(req, res) => {
    const datos = req.params.datos;

    //Paginación 
    const desde = Number(req.query.desde) || 0; //Si no dan nada o no dan un numero es 0
    const registropp = 10;

    console.log(datos);

    try{
        let productos, total;

        //Comprobacion si se ordena por cantidad(ASC/DESC) o precio(ASC/DESC)
        switch (datos) {
            case 'cantidadDESC':
                    [productos, total] = await Promise.all([
                    Producto.findAll({
                        order: [['stock', 'DESC']],
                        offset: desde,
                        limit: registropp,
                        include: [
                            Ubicacion,
                            Promocion,
                        ]
                    }),
                    //Total de usuarios que hay en la base de datos
                    Producto.count()
                    ]);

                break;
            case 'cantidadASC':
                    [productos, total] = await Promise.all([
                    Producto.findAll({
                        order: [['stock', 'ASC']],
                        offset: desde,
                        limit: registropp,
                        include: [
                            Ubicacion,
                            Promocion,
                        ]
                    }),
                    //Total de usuarios que hay en la base de datos
                    Producto.count()
                    ]);

                break;
            case 'precioASC':
                    [productos, total] = await Promise.all([
                    Producto.findAll({
                        order: [['precio', 'ASC']],
                        offset: desde,
                        limit: registropp,
                        include: [
                            Ubicacion,
                            Promocion,
                        ]
                    }),
                    //Total de usuarios que hay en la base de datos
                    Producto.count()
                    ]);

                break;
            case 'precioDESC':
                    [productos, total] = await Promise.all([
                    Producto.findAll({
                        order: [['precio', 'DESC']],
                        offset: desde,
                        limit: registropp,
                        include: [
                            Ubicacion,
                            Promocion,
                        ]
                    }),
                    //Total de usuarios que hay en la base de datos
                    Producto.count()
                    ]);

                break;
                   
            default:
                    [productos, total] = await Promise.all([
                        Producto.findAll({
                            where: {
                                [Op.or]: [
                                    { nombre: { [Op.like]: `%${datos}%` } },
                                    { marca: { [Op.like]: `%${datos}%` } },
                                    { categoria: { [Op.like]: `%${datos}%` } },
                                ],
                            },
                            offset: desde,
                            limit: registropp,
                            include: [
                                Ubicacion,
                                Promocion,
                            ]
                        }),
                        //Total de usuarios que hay en la base de datos
                        Producto.count()
                    ]);
                break;
            
        }

        
        res.json({
            ok: true,
            msg: 'buscarProductos',
            productos: productos,
            page: {
                desde,
                registropp,
                total
            }
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error buscando productos',
            error: error
        });
    }
}


const crearProducto = async(req, res) => {
    
    try{
        
        //Hacemos la request
        const producto = await Producto.create(req.body);

        res.json({
            ok: true,
            msg: 'crearProductos',
            producto: producto
        });
    }catch (error) {
        return res.status(400).json({
            ok: false,
            msg: 'Error creando el producto',
            error: error
        });
    }
    
}

const actualizarProducto = async(req,res) => {
    try{
        const id = req.params.id;
        const { nombre, marca, categoria, stock, valor_energetico, grasas, grasas_saturadas, azucares, fibra, proteina, sal, precio_kg, ingredientes, foto, precio } = req.body;

        const producto = await Producto.findByPk(id);

        await producto.update( {
            nombre: nombre, 
            marca: marca,
            categoria: categoria, 
            stock: stock,
            valor_energetico: valor_energetico,
            grasas: grasas,
            grasas_saturadaso: grasas_saturadas,
            azucares: azucares,
            fibra: fibra,
            proteina: proteina,
            sal: sal,
            precio_kg: precio_kg,
            ingredientes: ingredientes,
            foto: foto,
            precio: precio
        });
        
        res.json({
            ok: true,
            msg: 'actualizarProducto',
            producto: producto
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando el producto',
            error: error
        });
    }
}

const borrarProducto = async(req, res) => {
    try{
        const id = req.params.id;
        const producto = await Producto.findByPk(id);
        await producto.destroy();

        res.json({
            ok: true,
            msg: 'borrarUsuario',
            producto: producto
        });
    }catch (error){
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando el producto'
        });
    }
}

module.exports = { obtenerProducto, crearProducto, actualizarProducto, borrarProducto, buscarProducto };