/**
 * Módulo de conexão com o banco de dados
 * Uso do framework mongoose
 */

// importação do mongoose
const mongoose = require("mongoose");
//NAO ESQUECER DE NSTALAR O MODULO!!!!!!!!!!
//(npm i mongoose)

// configuração do banco de dados
// ip/link do servidor, autenticação
// ao final da url definir o nome do banco de dados
// exemplo: /dbclientes
const url =
  "mongodb://localhost:27017";
// validação (evitar a abertura de várias conexões)
let connectad = false;

// método para conectar com o banco de dados
const connectDB = async () => {
  // se não estiver conectado
  if (!connectad) {
    //conectar com o banco de dados
    try {
      await mongoose.connect(url); //conectar
      connectad = true; //setar a variável
      console.log("MongoDB conectado");
      return true;
    } catch (error) {
      //tratamento de exceções especifica
      console.log(error);
      return false;
    }
  }
};

// método para desconectar do banco de dados
const disconnectDB = async () => {
  // se estiver conectado
  if (connectad) {
    // desconectar
    try {
      await mongoose.disconnect(url); //desconectar
      connectad = false; //setar a variável
      console.log("MongoDB desconectado");
    } catch (error) {
      console.log(error);
    }
  }
};

//exportar para o main os métodos conectar e desconectar
module.exports = { connectDB, disconnectDB };
