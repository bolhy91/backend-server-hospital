const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jsonWebToken = require('jsonwebtoken');
const SEED = require('../config').SEED;

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({
        correo: body.correo
    }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                message: 'Credenciales no correctas - email',
                ok: false,
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                message: 'Credenciales no correctas - password',
                ok: false,
                errors: err
            });
        }

        //Crear un token
        usuario.password = ':)';
        var token = jsonWebToken.sign({
            usuario
        }, SEED, {
            expiresIn: 14400
        })

        return res.status(200).json({
            usuario,
            id: usuario.id,
            ok: true,
            message: 'Login correcto',
            token
        });

    });
});







module.exports = app;