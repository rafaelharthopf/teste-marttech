const express = require('express');
const router = express.Router();


const UsuariosController = require('../controllers/usuarios-controller')

router.post('/cadastro', UsuariosController.cadastrarUsuarios);

router.post('/login', UsuariosController.loginUsuario );

module.exports = router;