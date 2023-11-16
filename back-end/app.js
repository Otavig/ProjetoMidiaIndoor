const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const bodyparser = require("body-parser")

const app = express()
app.use(cors())
const porta = 3000  
app.use(bodyparser.json())

app.listen(porta, () => {
    console.log(`o servidor está rodando em http://localhost:${porta}`)
})

// criar uma pool de conexão
const pool = mysql.createPool({
    host: `localhost`,
    user: `root`,
    password: ``,
    database: `midia_indoor`,
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0

})

// rota pra SELECT
app.get(`/api/midia_indoor`, async (req, res) => {
    try {
        const conexao = await pool.getConnection()
        const sql = `SELECT * FROM midia`
        //console.log(sql)
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json(linha)

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// rota pra SELECT com o ID
app.get(`/api/midia_indoor/id/:id`, async (req, res) => {
    try {
        const id = req.params.id
        const conexao = await pool.getConnection()
        const sql = `SELECT * FROM midia WHERE id = ${id}`
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json(linha[0])

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// Rota para SELECT com o nome
app.get(`/api/midia_indoor/nome/:nome`, async (req, res) => {
    try {
        const nome = req.params.nome
        const conexao = await pool.getConnection()
        const sql = `SELECT * FROM midia WHERE nome LIKE "%${nome}%"`
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json(linha)

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// rota para cadastrar 
app.post("/api/midia_indoor/", async (req, res) => {
    try {
        const { nome, tipo , status , data_inicio , data_fim , url, tempo } = req.body
        const conexao = await pool.getConnection()
        const sql = `INSERT INTO midia (nome, tipo , status , data_inicio , data_fim , url, tempo ) VALUE ("${nome}", "${tipo}" , "${status}" , "${data_inicio}" , "${data_fim}" , "${url}" , "${tempo}")`
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json({msg: "Registro gravado!"})

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// Rota para Editar
app.put("/api/midia_indoor/", async (req, res) => {
    try {
        const {id, nome, tipo , status , data_inicio , data_fim , url, tempo} = req.body
        const conexao = await pool.getConnection()
        const sql = `UPDATE usuario SET nome = "${nome}", tipo = "${tipo}" , status = "${status}", data_inicio = "${data_inicio}" , data_fim = "${data_fim}" , url = "${url}" , tempo = "${tempo}" WHERE id = ${id}`
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json({ msg: "Registro Atualizado!" })

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na exclusão" })
    }
})

// Rota pra deletar
app.delete("/api/usuarios/:id", async (req, res) => {
    try {
        const id = req.params.id
        const conexao = await pool.getConnection()
        const sql = `DELETE FROM usuario WHERE id = ${id}`
        const [linha] = await conexao.execute(sql)
        conexao.release()
        res.json({ msg: "Registro excluido!" })

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na exclusão" })
    }
})