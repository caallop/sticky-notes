/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// importação do mongoose
const mongoose = require('mongoose')
//NAO ESQUECER DE NSTALAR O MODULO!!!!!!!!!!
//(npm i mongoose)

// configuração do banco de dados
// ip/link do servidor, autenticação 
// ao final da url definir o nome do banco de dados
// exemplo: /dbclientes
const url = 'mongodb+srv://admin:123Senac@hamburgueria.35fdg.mongodb.net/dbnotes'
// validação (evitar a abertura de várias conexões)
let conectado = false

// método para conectar com o banco de dados
const conectar = async () => {
    // se não estiver conectado
    if (!conectado) {
        //conectar com o banco de dados
        try {
            await mongoose.connect(url) //conectar
            conectado = true //setar a variável
            console.log("MongoDB conectado")
            return true
        } catch (error) {
            //tratamento de exceções especifica
            console.log(error)
            return false

        }

    }
}

// método para desconectar do banco de dados
const desconectar = async () => {
    // se estiver conectado
    if (conectado) {
        // desconectar
        try {
            await mongoose.disconnect(url) //desconectar
            conectado = false //setar a variável
            console.log("MongoDB desconectado")
        } catch (error) {
            console.log(error)
        }
    }
}

//exportar para o main os métodos conectar e desconectar
module.exports = { conectar, desconectar }