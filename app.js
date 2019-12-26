var express = require('express');
const mongoose = require('mongoose');

let app = express();

//Connection DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true
}, (err, res) => {
    if (err) throw err;
    console.log('Corriendo Base de datos MongoDB');
});


//Rutas
app.get('/', function (req, res) {
    res.status(200).json({
        message: 'Hola Mundo',
        ok: true
    });
});

app.listen(3000, () => {
    console.log("Express server 3000");
});
