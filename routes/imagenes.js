const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs')

//Rutas
app.get('/:tipo/:img', function (req, res) {

    const tipo = req.params.tipo;
    const img = req.params.img;

    let pathImagen = path.resolve( __dirname, `../upload/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) {
        res.sendFile( pathImagen );
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        res.sendFile(pathNoImage);
    }
});


module.exports = app;