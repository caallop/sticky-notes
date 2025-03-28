/**
 * Modelos de dados das notqas
 * Criaçao da coleçao
 */

//importaçao dos recusrsos do moongose
const { model, Schema, version } = require('mongoose')

//criaçao da estutura da coleçao
const noteSchema = new Schema({
    texto: {
        type: String

    },
    cor: {
        type: String
    }
}, { versionKey: false })
//exportar o modelo de dados para o main.js
module.exports = model('Notas', noteSchema)