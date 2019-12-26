const express = require('express');

const app = express();

//Rutas
app.get('/', function (req, res) {
    res.status(200).json({
        message: 'Hola Mundo',
        ok: true
    });
});


module.exports = app;