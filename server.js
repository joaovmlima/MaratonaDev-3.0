const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

// server and page init
nunjucks.configure("./", {
    express: server,
    noCache: true
})

server.listen(42000, function() {
    console.log('server is up!')
})

server.use(express.static('public'))
server.use(express.urlencoded({extended: true}))

// configurar página e inserir os dados do BD
server.get("/", function(req, res) {
    db.query(`SELECT * FROM donors`, function(err, result) {
        if(err) return res.send("Erro no Banco de Dados")
        const donors = result.rows
    return res.render("index.html", {donors})
    })
})

// comunicação com DB
const Pool = require('pg').Pool

const db = new Pool({
    user: 'username',
    password: 'password',
    host: 'localhost',
    port: 1234,
    database: 'maratonadev3'
})

// pegar os dados do form
server.post("/", function(req, res) {
    const name = req.body.name
    const blood = req.body.blood
    const email = req.body.email

    if(name == "" || blood == "" || email == "") {
        return res.send("Preencha todos os campos!")
    }

    // inserir os dados do form no DB
    const insertData = `
        INSERT INTO donors ("name", "blood", "email") VALUES ($1, $2, $3)`

    const donorInfo = [name, blood, email]

    db.query(insertData, donorInfo, function(err) {
        if(err)             
            return res.send("Erro no Banco de Dados")
        return res.redirect("/")
    })

})
