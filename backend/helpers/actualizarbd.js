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
            producto.foto = nombreArchivo;
            await producto.save();

            // La imagen por defecto y las fotos compartidas siguen siendo necesarias.
            if (fotoVieja && fotoVieja !== 'no-imagen.png' && fs.existsSync(pathFotoVieja)
                && await Producto.count({ where: { foto: fotoVieja } }) === 0) {
                fs.unlinkSync(pathFotoVieja);
            }

            return true;

            break;

        default:
            return false;
            break;
    }
}

module.exports = { actualizarBD }