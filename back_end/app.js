const fs = require("fs")
const path = require("path")

const express = require("express")
const cors = require("cors")
const mysql = require("mysql2/promise")
const bodyparser = require("body-parser")

const app = express()
app.use(cors())
const porta = 3000
app.use(bodyparser.json())
const multer = require("multer")
const mw_upload = multer({ dest: "./dir_uploads" })

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

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/front-end/index.html')
})

app.get('/exibir', (req, res) => {
    res.sendFile(__dirname + '/front-end/midia.html')
})

// Rota para obter todas as mídias
app.get("/api/midia_indoor/", async (req, res) => {
    try {
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM midia`;
        const [linha] = await conexao.execute(sql);
        conexao.release();
        res.json(linha);
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro na busca" });
    }
});

app.use("", express.static("front-end/"))


app.post("/upload", mw_upload.single("arquivo"), (req, res) => {
    try {
        console.log(req.file);

        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo foi enviado." });
        }

        let arq_recebido = req.file.path;
        let arq_destino = "front-end/midias/" + req.file.filename + path.extname(req.file.originalname);

        // Movendo arquivo recebido
        fs.renameSync(arq_recebido, arq_destino);

        res.status(200).json({
            message: "Arquivo recebido e movido com sucesso.",
            filename: req.file.filename + path.extname(req.file.originalname),
        });
    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).json({ error: "Erro interno durante o upload." });
    }
});

// Rota para SELECT com o status
app.get(`/api/midia_indoor/status/:status`, async (req, res) => {
    try {
        const status = req.params.status;
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM midia WHERE status = '${status}'`;
        const [linha] = await conexao.execute(sql);
        console.log(sql);
        console.log(linha);
        conexao.release();
        res.json(linha);
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro na busca" });
    }
});

// Rota para SELECT com o tipo
app.get(`/api/midia_indoor/tipo/:tipo`, async (req, res) => {
    try {
        const tipo = req.params.tipo;
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM midia WHERE tipo = '${tipo}'`;
        const [linha] = await conexao.execute(sql);
        console.log(sql);
        console.log(linha);
        conexao.release();
        res.json(linha);
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro na busca" });
    }
});


// rota pra SELECT com o ID
app.get(`/api/midia_indoor/id/:id`, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM midia WHERE id = ${id}`;

        const [linha] = await conexao.execute(sql);
        console.log(sql);
        conexao.release();
        res.json(linha[0]);

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// Rota para SELECT com o nome
app.get(`/api/midia_indoor/nome/:nome`, async (req, res) => {
    try {
        const nome = req.params.nome;
        const conexao = await pool.getConnection();
        const sql = `SELECT * FROM midia WHERE nome LIKE "%${nome}%"`;
        const [linha] = await conexao.execute(sql);
        console.log(sql);
        conexao.release();
        res.json(linha);

    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`)
        res.send(500).json({ error: "Deu algum erro na busca" })
    }
})

// rota para cadastrar 
app.post("/api/midia_indoor/", async (req, res) => {
    try {
        const { nome, tipo, status, data_inicio, data_fim, url, tempo } = req.body;
        const conexao = await pool.getConnection();
        const sql = `INSERT INTO midia (nome, tipo, status, data_inicio, data_fim, url, tempo) VALUES ("${nome}", "${tipo}", "${status}", "${data_inicio}", "${data_fim}", "${url}", ${tempo})`;
        console.log(sql);
        const [linha] = await conexao.execute(sql);
        conexao.release();
        res.json({ msg: "Registro gravado!" });
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro no cadastro" });
    }
});


// Rota para Editar
app.put("/api/midia_indoor/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, tipo, status, data_inicio, data_fim, url, tempo } = req.body;

        const conexao = await pool.getConnection();
        const sql = `UPDATE midia SET nome = "${nome}", tipo = "${tipo}", status = "${status}", data_inicio = "${data_inicio}", data_fim = "${data_fim}", url = "${url}", tempo = "${tempo}" WHERE id = "${id}"`;
        const [linha] = await conexao.execute(sql);
        conexao.release();

        res.json({ msg: "Registro Atualizado!" });
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro na atualização" });
    }
});

// Rota para deletar
app.delete("/api/midia_indoor/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const conexao = await pool.getConnection();
        
        // Primeiro, busca a informação da mídia para obter o nome do arquivo
        const selectSql = `SELECT * FROM midia WHERE id = ${id}`;
        const [selectResult] = await conexao.execute(selectSql);

        if (selectResult.length === 0) {
            conexao.release();
            return res.status(404).json({ error: "Mídia não encontrada." });
        }

        const url_midia = selectResult[0].url;
        
        // Deleta a entrada da mídia no banco de dados
        const deleteSql = `DELETE FROM midia WHERE id = ${id}`;
        await conexao.execute(deleteSql);

        // Deleta o arquivo de imagem
        const caminho_arquivo = path.join(__dirname, `front-end/midias/${url_midia}`);
        fs.unlinkSync(caminho_arquivo);

        conexao.release();
        res.json({ msg: "Registro excluído!" });
    } catch (error) {
        console.log(`O erro que ocorreu foi: ${error}`);
        res.status(500).json({ error: "Deu algum erro na exclusão" });
    }
});



app.listen(porta, () => {
    console.log(`o servidor está rodando em http://localhost:${porta}`)
})