const mysql = require('../mysql').pool;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.cadastrarUsuarios = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err) { return res.status(500).send({ error: error}) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', [req.body.email], (error, results) => {
            if(err) { return res.status(500).send({ error: error}) }
            if (results.length > 0) {
                res.status(409).send({ message: 'User exists'})
            } else {
                bcrypt.hash(req.body.password, 10, (errBcrypt, hash) => {
                    if(errBcrypt) { return res.status(500).send({error: errBcrypt}) }
                    conn.query(`INSERT INTO usuarios (email, password) VALUES (?,?)`,
                    [req.body.email, hash],
                    (error, results) => {
                        conn.release();
                        if(error) { return res.status(500).send({ error: error}) }
                        response ={
                            message: 'User created successfully',
                            userCreate: {
                                id_usuario: results.insertId,
                                email: req.body.email
                            }
                        }
                        return res.status(201).send(response);
                    }
                    )
                })
            }
        })

    });
}

exports.loginUsuario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: error}) }
        conn.query('SELECT * FROM usuarios WHERE email = ?', 
        [req.body.email], (error, results, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ error: error}) }
            if (results.length < 1) {
                return res.status(401).send({ message: 'authentication failed 1'})
            }
            bcrypt.compare(req.body.password, results[0].password, (err, result) => {
                if (err) {
                    return res.status(401).send({ message: 'authentication failed 2'})
                }
                if (result) {
                    const token = jwt.sign({
                        id_usuario: results[0].id_usuario,
                        email: results[0].email
                    }, 
                    process.env.JWT_KEY,
                    {
                        expiresIn: "120h"
                    });

                    return res.status(200).send({ 
                        message: 'successfully authenticated', 
                        token: token
                    })
                }
                return res.status(401).send({ message: 'successfully authenticated' })
            });
        })
    })
}