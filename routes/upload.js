const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
var Usuario = require('../models/usuario')
var Medico = require('../models/medico')
var Hospital = require('../models/hospital')
var fs = require('fs');

app.use(fileUpload());

//Rutas
app.put('/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;
    //tipos de coleccion
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'tipo invalido',
            errors: {
                message: 'Seleccione un tipo valido: ' + tiposValidos.join(',')
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No contiene archivos adjuntos',
            errors: {
                message: 'Seleccione un archivo'
            }
        });
    }

    let archivo = req.files.imagen;
    let nombreCortado = archivo['name'].split('.');
    let extension = nombreCortado[nombreCortado.length - 1];
    //Solo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Extension no valida',
            errors: {
                message: 'Las extensiones validas son: ' + extensionesValidas.join(',')
            }
        });
    }
    // Nombre de archivo personalizado
    let nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${ extension }`;
    //Mover el archivo del temporal a un path especifico
    let path = `./upload/${ tipo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al mover archivo',
                errors: err
            });
        }
        subirPorTipo(tipo, id, nombreArchivo, res)
    });
});


function subirPorTipo(tipo, id, nombreArchivo, res) {
    
    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    message: 'El usuario no existe'
                })
            }

            var pathViejo = './upload/usuarios'+ usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
                
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuario) => {
                return res.status(200).json({
                    message: 'Imagen del usuario actualizassa',
                    ok: true, 
                    usuario: usuario
                });
            });
        });
    }

    if (tipo === 'medicos') {
         Medico.findById(id, (err, medicos) => {
              if (!medicos) {
                  return res.status(400).json({
                      ok: true,
                      message: 'El medico no existe'
                  })
              }
             var pathViejo = './upload/medicos' + medicos.img;
             if (fs.existsSync(pathViejo)) {
                 fs.unlink(pathViejo);

             }
             medicos.img = nombreArchivo;
             medicos.save((err, medico) => {
                 return res.status(200).json({
                     message: 'Imagen del medico actualizado',
                     ok: true,
                     medico: medicos
                 });
             });
         });

    }

    if (tipo === 'hospitales') {
        
        Hospital.findById(id, (err, hospital) => {
             if (!hospital) {
                 return res.status(400).json({
                     ok: true,
                     message: 'El hospital no existe'
                 })
             }
            var pathViejo = './upload/hospitales' + hospital.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);

            }
            hospital.img = nombreArchivo;
            hospital.save((err, medico) => {
                return res.status(200).json({
                    message: 'Imagen del medico actualizado',
                    ok: true,
                    hospital
                });
            });
        });

    }
}

module.exports = app;