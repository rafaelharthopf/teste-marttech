const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');



app.use('/uploads', express.static('uploads'));

const rotaProdutos = require('./routes/produtos');
const rotaPedidos = require('./routes/pedidos');
const rotaUsuarios = require('./routes/usuarios');

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extend: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Acces-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Header', 'Content-Type',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if(req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, PATH, DELETE, GET'
        )
        return res.status(200).send({});
    }
    next();
})

app.use('/produtos', rotaProdutos);
app.use('/pedidos', rotaPedidos);
app.use('/usuarios', rotaUsuarios)


app.use((req, res, next) => {
    const erro = new Error('Not found');
    erro.status = 404;
    next(erro);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.send ({
        message: error.message
    })
})



module.exports = app;