const { Producto } = require('../models/productos');
const fs = require('fs');

const actualizarBD = async(tipo, path, nombreArchivo, id) => {

    switch (tipo) {
        
        case 'fotoproducto':

            const producto = await Producto.findByPk(id);
            if (!producto) {
                return false;
            }

            const fotoVieja = producto.foto;
            const pathFotoVieja = `${path}/${fotoVieja}`;
            if (fotoVieja && fs.existsSync(pathFotoVieja)) {
                fs.unlinkSync(pathFotoVieja);
            }

            producto.foto = nombreArchivo;
            await producto.save();

            return true;

            break;

        default:
            return false;
            break;
    }
}

module.exports = { actualizarBD }