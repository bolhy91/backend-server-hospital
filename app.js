var express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();

const hospitalRoutes = require('./routes/hospital');
const medicoRoutes = require('./routes/medico');
const bsuquedaRoutes = require('./routes/busqueda');
const uploadRoutes = require('./routes/upload');
const imgRoutes = require('./routes/imagenes');


//COnfiguration
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//routes
app.use('/usuario', usuarioRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/login', loginRoutes);
app.use('/', routes);
app.use('/busqueda', bsuquedaRoutes);
app.use('/uploads', uploadRoutes);
app.use('/img', imgRoutes);

//Connection DB

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true
}, (err, res) => {
    if (err) throw err;
    console.log('Corriendo Base de datos MongoDB');
});


app.listen(3000, () => {
    console.log("Express server 3000");
});