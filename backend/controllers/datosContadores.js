const { DatosContadores} = require('../models/datosContadores');
const { Producto } = require('../models/productos');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

async function obtenerDatosContadores(req, res) {
    const nombre = req.query.nombre; //?nombre=nombre_estadistica

    try {
        let datosContadores;
        if(nombre == "anadido"){
            datosContadores = await DatosContadores.findAll({
                attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: { nombre: nombre },
                group: ['idProd'],
                order: [[Sequelize.literal('totalCount'), 'DESC']]
            });
        }
        if(nombre == "eliminado"){
            datosContadores = await DatosContadores.findAll({
                attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: { nombre: nombre },
                group: ['idProd'],
                order: [[Sequelize.literal('totalCount'), 'DESC']]
            });
        }
        if(nombre == "qr"){
            // Obtener la fecha actual
            let currentDate = new Date();

            // Calcular la fecha hace una semana
            let oneWeekAgo = new Date(currentDate);
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            // Calcular la fecha hace una semana
            let twoWeekAgo = new Date(currentDate);
            twoWeekAgo.setDate(twoWeekAgo.getDate() - 14);

            qrEstaSemana = await DatosContadores.findAll({
                attributes: [[Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: {
                    nombre: nombre,
                    fecha: {
                      [Op.between]: [oneWeekAgo, currentDate] // Filtrar por la última semana
                    }
                }
            });

            qrSemanaPasada = await DatosContadores.findAll({
                attributes: [[Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: {
                    nombre: nombre,
                    fecha: {
                      [Op.between]: [twoWeekAgo, oneWeekAgo] // Filtrar por la última semana
                    }
                }
            });
            datosContadores = {
                qrEstaSemana: qrEstaSemana[0].dataValues.totalCount,
                qrSemanaPasada: qrSemanaPasada[0].dataValues.totalCount
            };
        }
        
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