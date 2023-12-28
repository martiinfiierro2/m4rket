const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { actualizarBD } = require('../helpers/actualizarbd');
const fs = require('fs');

const subirArchivo = async(req, res = response) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo',
        });
    }
    if (!req.files.archivo) {
        return res.status(400).json({
            ok: false,
            msg: `Debe enviarse el archivo como form-data llamado 'archivo'`,
        });
    }
    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        });
    }

    const tipo = req.params.tipo; // fotoperfil   fotoproducto
    const id = req.params.id;

    const archivosValidos = {
        fotoproducto: ['jpeg', 'jpg', 'png'],
    }

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];

    switch (tipo) {
        case 'fotoproducto':
            if (!archivosValidos.fotoproducto.includes(extension)) {
                return res.status(400).json({
                    ok: false,
                    msg: `El tipo de archivo '${extension}' no está permtido (${archivosValidos.fotoproducto})`
                });
            }
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: `El tipo de operacion no está permtida`,
                tipoOperacion: tipo
            });
            break;
    }

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const patharchivo = `${path}/${nombreArchivo}`;
    console.log(patharchivo);

    archivo.mv(patharchivo, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }
        const token = req.header('x-token');
        actualizarBD(tipo, path, nombreArchivo, id)
            .then(valor => {
                if (!valor) {
                    fs.unlinkSync(patharchivo);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se pudo establecer la nueva foto de perfil`,
                    });
                } else {
                    res.json({
                        ok: true,
                        msg: 'subirArchivo',
                        nombreArchivo
                    });
                }

                // controlar valor
            }).catch(error => {
                fs.unlinkSync(patharchivo);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar archivo`
                });
            });
    });
}

const enviarArchivo = async(req, res = response) => {
    const tipo = req.params.tipo; // fotoperfil   fotoproducto
    const nombrearchivo = req.params.nombrearchivo;

    const path = `${process.env.PATHUPLOAD}/${tipo}`;
    const patharchivo = `${path}/${nombrearchivo}`;

    if(!fs.existsSync(patharchivo)){
        res.status(400).json({
            ok: false,
            msg: 'No existe archivo'
        })
    }
    res.sendFile(patharchivo);
}

module.exports = { subirArchivo, enviarArchivo }