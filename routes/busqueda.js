const express = require('express');

const app = express();
var Hospital = require('../models/hospital')
var Medico = require('../models/medico')
var Usuario = require('../models/usuario')

app.get('/coleccion/:tabla/:busqueda', (req, res) => {
    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex)
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex)
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex)
            break;

        default:
            return res.status(400).json({
                ok: false,
                message: 'Los tipos de busqueda solo son: usuarios, medicos y hospitales',
                error: {
                    message: 'Tipo de modelo no valido'
                }
            })
    }
    
    promesa.then(data => {
        return res.status(200).json({
            ok: false,
            [tabla]: data
        })
    })

});


//Rutas
app.get('/todo/:busqueda', function (req, res) {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            })
        });
});

function buscarHospitales(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({
                nombre: regex
            }).populate('usuario', 'nombre correo')
            .exec((err, hospitales) => {
                if (err) {
                    reject('Erro al cargar hospitales', err)
                } else {
                    resolve(hospitales)
                }
            });
    })

}

function buscarMedicos(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Medico.find({
                nombre: regex
            }).populate('usuario', 'nombre correo').populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('Erro al cargar hospitales', err)
                } else {
                    resolve(medicos)
                }
            });
    })

}

function buscarUsuarios(busqueda, regex) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre correo role')
            .or([{
                nombre: regex
            }, {
                correo: regex
            }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            });
    })

}


module.exports = app;