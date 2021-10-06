const mysql = require('../mysql');


exports.getProdutos = async(req, res, next) => {
    try {
        const result = await mysql.execute('SELECT * FROM produtos;')
        const response = {
            quantities: result.length,
            product: result.map(prod => {
                return {
                    id_produto: prod.id_produto,
                    name: prod.name,
                    price: prod.price,
                    imagem_produto: prod.imagem_produto,
                    request: {
                        type: 'GET',
                        description: 'Returns the details of a specific product',
                        url: 'http://localhost:3000/produtos/' + prod.id_produto
                    }
                }
            })
        }
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error});
    }
}


exports.postProduto = (req, res, next) => {
    try {
        const query = 'INSERT INTO produtos (name, price) VALUES (?,?)';
        const result = mysql.execute(query, [
            req.body.name, 
            req.body.price
        ]);
        const response = {
            message: 'Insert a product sucess',
            productCreate: {
                id_produto: result.id_produto,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'GET',
                    description: 'Return all products',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }

        return res.status(201).send(response);

    } catch (error) {
        if(error) { return res.status(500).send({ error : error }) }
    }
}

exports.getUmProduto = async(req, res, next) => {
    try {
        const query = 'SELECT * FROM produtos WHERE id_produto = ?;'
        const result = await mysql.execute(query, [req.params.id_produto]);
        if(result.length ==0) {
            return res.status(404).send({
                message: 'Not found'
            })
        }
        const response = {
            product: {
                id_produto: result[0].id_produto,
                name: result[0].name,
                price: result[0].price,
                request: {
                    type: 'GET',
                    description: 'Return all products',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}

exports.updateProduto = async(req, res, next) => {
    try {
        const query = `UPDATE produtos SET name = ?, price = ? WHERE id_produto = ?;`
        await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.body.id_produto
        ]);
        const response = {
            message: 'Updated product',
            updatedProduct: {
                id_produto: req.body.id_produto,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'POST',
                    description: 'Returns the details of a specific product',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error});
    }
}

exports.deleteProduto = async(req, res, next) => {
    try {
        const query = `DELETE FROM produtos WHERE id_produto = ?`
        await mysql.execute(query, [req.body.id_produto]);
        const response = {
            message: 'Product removed',
            request: {
                type: 'POST',
                description: 'Insert a product',
                url: 'http://localhost:3000/produtos',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }
       return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error : error })
    }
}