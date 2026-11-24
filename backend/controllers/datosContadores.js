const { DatosContadores} = require('../models/datosContadores');
const { Producto } = require('../models/productos');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');

async function obtenerDatosContadores(req, res) {
    const nombre = req.query.nombre;
    const inicio = req.query.inicio;
    const fin = req.query.fin;
    const idUsuario = req.query.idUsu;
    const eventos = ['buscado', 'activo', 'anadido', 'eliminado', 'comprado', 'localizado', 'qr', 'secciones'];
    const rankings = { masbuscado: 'buscado', masanadido: 'anadido', maseliminado: 'eliminado', mascomprado: 'comprado' };

    try {
        const filtroFecha = {};
        if (inicio) filtroFecha[Op.gte] = inicio;
        if (fin) {
            if (/^\d{4}-\d{2}-\d{2}$/.test(fin)) {
                const siguiente = new Date(fin + 'T00:00:00Z');
                siguiente.setUTCDate(siguiente.getUTCDate() + 1);
                filtroFecha[Op.lt] = siguiente;
            } else filtroFecha[Op.lte] = fin;
        }
        const where = (inicio || fin) ? { fecha: filtroFecha } : {};
        let datosContadores;
        const porProducto = rankings[nombre] || (nombre === 'buscadousu' ? 'buscado' : (!inicio && !fin && eventos.includes(nombre) ? nombre : null));
        if (porProducto) {
            where.nombre = porProducto;
            if (nombre === 'buscadousu') where.id_usuario = idUsuario;
            datosContadores = await DatosContadores.findAll({
                attributes: ['idProd', [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where,
                group: ['idProd'],
                order: [[Sequelize.literal('totalCount'), 'DESC'], ['idProd', 'ASC']],
                ...(nombre === 'buscadousu' ? { limit: 5 } : {})
            });
        } else if (eventos.includes(nombre)) {
            datosContadores = await DatosContadores.findAll({
                attributes: [[Sequelize.literal('DATE(fecha)'), 'fecha'], [Sequelize.fn('COUNT', Sequelize.col('*')), 'totalCount']],
                where: { ...where, nombre },
                group: [Sequelize.literal('DATE(fecha)')],
                order: [[Sequelize.literal('fecha'), 'ASC']]
            });
        } else if (nombre === 'mediatiempos') {
            datosContadores = await DatosContadores.findAll({
                attributes: ['id_usuario', [Sequelize.fn('AVG', Sequelize.col('tiempo_uso')), 'media_tiempo_uso']],
                where: { ...where, nombre: 'activo', tiempo_uso: { [Op.not]: null } },
                group: ['id_usuario']
            });
        } else if (nombre === 'usuariounico') {
            datosContadores = await DatosContadores.findAll({
                attributes: [[Sequelize.literal('COUNT(DISTINCT id_usuario)'), 'total_usuarios']],
                where: { ...where, nombre: 'activo' }
            });
        } else {
            return res.status(400).json({ ok: false, msg: 'Estadística no válida' });
        }
        return res.json({ ok: true, msg: 'getDatosContadores', datosContadores });
    } catch (error) {
        return res.status(400).json({ ok: false, msg: 'Error obteniendo los datos', error });
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