var express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

const bodyParser = require('body-parser');

const app = express();

//COnfiguration

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


//routes
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', routes);

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