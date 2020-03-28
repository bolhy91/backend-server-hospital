const express = require('express');
const app = express();
const Medico = require('../models/medico');
const mAutenticacion = require('../middleware/autenticacion');

app.get('/', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    Medico.find({}).populate('usuario', 'nombre correo').populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return res.status(500).json({
                    message: 'Error cargando medicos',
                    ok: false,
                    errors: err
                });
            }
            Medico.count({}, (err, conteo) => {
                return res.status(200).json({
                    medicos,
                    ok: true,
                    total: conteo
                });
            });
            
        });
});


app.get('/:id', (req, res) => {
    var id = req.params.id;
    Medico.findById(id)
    .populate('usuario', 'nombre email img')
    .populate('hospital')
    .exec((err, medico) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al el buscar medico',
                ok: false,
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                message: 'Usuario no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el usuario con ese id'
                }
            });
        }

        return res.status(200).json({
            medico,
            ok: true
        });
    });
});

app.post('/', mAutenticacion.verificaToken, (req, res) => {

    const body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });
    medico.save((err, medico) => {
        if (err) {
            return res.status(400).json({
                message: 'Error al guardar el medico',
                ok: false,
                errors: err
            });
        }
        return res.status(201).json({
            medico,
            ok: true
        });
    });
});

app.put('/:id', mAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al el buscar medico',
                ok: false,
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                message: 'Usuario no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el usuario con ese id'
                }
            });
        }
        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        medico.save((err, medico) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error al actualizar el medico',
                    ok: false,
                    errors: err
                });
            }
            return res.status(200).json({
                medico,
                ok: true
            });
        });
    });
});

app.delete('/:id', mAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Medico.findByIdAndDelete(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al borrar el medico',
                ok: false,
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                message: 'Medico no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el medico con ese id'
                }
            });
        }

        return res.status(200).json({
            medico,
            ok: true
        });

    });
});

module.exports = app;