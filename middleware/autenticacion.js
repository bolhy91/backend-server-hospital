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
