const jsonWebToken = require('jsonwebtoken');
const SEED = require('../config').SEED;


exports.verificaToken = function(req, res, next) {
    var token = req.query.token;
    jsonWebToken.verify(token, SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                message: 'no autorizado',
                ok: false,
                errors: err
            });
        }
        req.usuario = decode.usuario;
        next();
    });
}

exports.verificaAdmin = function (req, res, next) {
    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            message: 'token incorrecto - NO es administrador',
            ok: false,
            errors: { message: 'No es administrador' }
        });
    }
}

exports.verificaAdmin_o_usuario = function (req, res, next) {
    var usuario = req.usuario;
    var id = req.params.id;

    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            message: 'token incorrecto - NO es administrador ni es el mismo usuario',
            ok: false,
            errors: {
                message: 'No es administrador'
            }
        });
    }
}
