const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const mAutentication = require('../middleware/autenticacion');

// Rutas de hospital
app.get('/', (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
    .populate('usuario', 'nombre correo')
    .exec((err, hospitales) => {
        if (err) {
            return res.status(500).json({
                message: 'Error cargando hospitales',
                ok: false,
                errors: err
            });
        }
        Hospital.count({}, (err, conteo) => {
            return res.status(200).json({
                hospitales,
                ok: true,
                total: conteo
            });

        });
    });
});

app.post('/', mAutentication.verificaToken,(req, res) => {
    const body = req.body;
    const hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id,
    })
    hospital.save((err, hospital) => {
        if (err) {
            return res.status(400).json({
                message: 'Error al guardar hospital',
                ok: false,
                errors: err
            });
        }
        return res.status(201).json({
            hospital,
            ok: true
        });
    });
});

app.put('/:id', mAutentication.verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;
    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al buscar hospital',
                ok: false,
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                message: 'Hospital no encontrado',
                ok: false,
                errors: {
                    message: 'No existe el hospital con ese id'
                }
            });
        }
        hospital.nombre = body.nombre;
        hospital.usuario = body.usuario;
   
        hospital.save((err, hospital) => {
            if (err) {
                return res.status(400).json({
                    message: 'Error al actualizar hospital',
                    ok: false,
                    errors: err
                })
            }
            return res.status(200).json({
                hospital,
                ok: true
            });
        });
    });
});

app.delete('/:id', mAutentication.verificaToken, (req, res) => {
    const id = req.params.id;
    Hospital.findByIdAndDelete(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                message: 'Error al borrar el hospital',
                ok: false,
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                message: 'El hospital no fue encontrado',
                ok: false,
                errors: {
                    message: 'No existe el hospital con ese id'
                }
            })
        }
        return res.status(200).json({
            hospital,
            ok: true
        });
    });
});

module.exports = app;