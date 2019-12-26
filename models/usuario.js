const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;


var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerido'],
    },
    password: {
        type: String,
        required: [true, 'El password es requerido'],
    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: '{PATH} el correo debe ser unico'
})

module.exports = mongoose.model('Usuario', usuarioSchema);