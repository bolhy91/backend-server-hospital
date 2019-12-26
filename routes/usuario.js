const express = require('express');
const app = express();
const bcryt = require('bcrypt');
var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middleware/autenticacion')


//Rutas
app.get('/', function (req, res) {


    Usuario.find({}, 'nombre correo img role')
        .exec((err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error cargando usuarios',
                    ok: false,
                    errors: err
                });
            }
            return res.status(200).json({
                usuarios,
                ok: true
            });
        });
});

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    const body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        correo: body.correo,
        password: bcryt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                message: 'Error al guardar usuario',
                ok: false,
                errors: err
            });
        }

        return res.status(201).json({
            usuario,
            ok: true
        });
    });
});

app.put('/:id',mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                message: 'Usuario no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el usuario con ese id'
                }
            });
        }

        usuario.nombre = body.nombre;
        usuario.correo = body.correo;
        usuario.role = body.role;

        usuario.save((err, usuario) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error al actualizar usuario',
                    ok: false,
                    errors: err
                });
            }

            usuario.password = ':)';

            return res.status(200).json({
                usuario,
                ok: true
            });
        });
    });
});

//Delete user

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.findByIdAndDelete(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al borrar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                message: 'Usuario no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el usuario con ese id'
                }
            });
        }

        return res.status(200).json({
            usuario,
            ok: true
        });

    });
});


module.exports = app;