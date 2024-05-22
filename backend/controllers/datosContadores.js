const { DatosContadores} = require('../models/datosContadores');
const { Producto } = require('../models/productos');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

async function obtenerDatosContadores(req, res) {
    const nombre = req.query.nombre; //?nombre=nombre_estadistica
    const inicio = req.query.inicio || null;
    const fin = req.query.fin || null;
    const idUsuario = req.query.idUsu || null;


    try {
        let datosContadores;
        if (nombre === "buscado") {
            if (inicio !== null && fin !== null) {
                datosContadores = await DatosContadores.findAll({
                    attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                    where: {
                        nombre: nombre,
                        fecha: {
                            [Sequelize.Op.between]: [inicio, fin]
                        }
                    },
                    group: ['idProd'],
                    order: [[Sequelize.literal('totalCount'), 'DESC']]
                });
            } else {
                datosContadores = await DatosContadores.findAll({
                    attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                    where: { nombre: nombre },
                    group: ['idProd'],
                    order: [[Sequelize.literal('totalCount'), 'DESC']]
                });
            }
        }
        else if(nombre === "activo" || nombre === "eliminado" || nombre === "anadido"|| nombre === "comprado" || nombre === "localizado"){
            datosContadores = await DatosContadores.findAll({
                attributes: [
                    [Sequelize.literal('DATE(fecha)'), 'fecha'],
                    [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']
                ],
                where: {
                    nombre: nombre,
                    fecha: {
                        [Sequelize.Op.between]: [inicio, fin]
                    }
                },
                group: [Sequelize.literal('DATE(fecha)')], 
                order: [[Sequelize.literal('fecha'), 'ASC']] 
            });
        }
        else if(nombre === "buscadousu"){
            datosContadores = await DatosContadores.findAll({
                attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: {
                    nombre: 'buscado',
                    fecha: {
                        [Sequelize.Op.between]: [inicio, fin]
                    },
                    id_usuario: idUsuario
                },
                group: ['idProd'],
                order: [[Sequelize.literal('totalCount'), 'DESC']],
                limit: 5
            });
            
        }
        else if(nombre === "mediatiempos") {
            datosContadores = await DatosContadores.findAll({
                attributes: [
                    'id_usuario',
                    [Sequelize.literal('AVG(tiempo_uso)'), 'media_tiempo_uso'] 
                ],
                where: {
                    nombre: 'activo',
                    fecha: {
                        [Sequelize.Op.between]: [inicio, fin]
                    },
                    tiempo_uso: {
                        [Sequelize.Op.not]: null
                    }
                },
                group: ['id_usuario']
            });
        }else if (nombre === "usuariounico") {
            datosContadores = await DatosContadores.findAll({
                attributes: [
                    [Sequelize.literal('COUNT(DISTINCT id_usuario)'), 'total_usuarios'] 
                ],
                where: {
                    nombre: 'activo',
                    fecha: {
                        [Sequelize.Op.between]: [inicio, fin]
                    }
                }
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