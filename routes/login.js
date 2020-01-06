const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const jsonWebToken = require('jsonwebtoken');
const SEED = require('../config').SEED;
const CLIENT_ID = require('../config').CLIENT_ID;
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {
    let token = req.body.token;

    var googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                message: 'Token no valido'
            });
        });

    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar usuario',
                ok: false,
                errors: err
            });
        }

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    message: 'Debe utilizar su autenticacion normal',
                    ok: false
                });
            } else {
                var token = jsonWebToken.sign({
                    usuarioDB
                }, SEED, {
                    expiresIn: 14400
                })

                return res.status(200).json({
                    usuario: usuarioDB,
                    id: usuarioDB._id,
                    ok: true,
                    message: 'Login correcto',
                    token
                });
            }
        } else {
            // el usuario no existe hay que crearlo
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.correo = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        message: 'Error al almacenar el usuario',
                        ok: false
                    });
                }

                var token = jsonWebToken.sign({
                    usuario
                }, SEED, {
                    expiresIn: 14400
                })

                return res.status(200).json({
                    usuario,
                    id: usuario._id,
                    ok: true,
                    message: 'Login correcto',
                    token
                });

            });
        }
    });
});

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
            id: usuario._id,
            ok: true,
            message: 'Login correcto',
            token
        });

    });
});







module.exports = app;