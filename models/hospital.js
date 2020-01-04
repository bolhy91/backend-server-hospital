const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hospitalSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del hospital es necesario']
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El id del usuario es necesario']
    }
});

module.exports = mongoose.model('Hospital', hospitalSchema);