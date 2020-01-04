const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const medicoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del medico es necesario']
    },
    img: {
        type: String
    },
    usuario: {
        type: Schema.Types.ObjectId, 
        ref: 'Usuario',
        required: [true, 'El id del usuario es un campo obligatorio']
    },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: [true, 'El id del hospital es un campo obligatorio']
    }
});

module.exports = mongoose.model('Medico', medicoSchema);