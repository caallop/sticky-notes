/**
 *
 * processo de renderizaçao do documento index.html
 */
console.log("Processo de renderizaçao");

//estrategia para renderizar(desenhar as notas adesivas)
//usar uma lista para preencher de forma dinamica os itens (que na verdade são as notas)

// vetor global para manipular os dados do banco
let arrayNotes = [];

//captura do id da list (Ul) do documento index.html
const list = document.getElementById("listNotes");

// inserção da data no rodapé
function obterData() {
  const data = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return data.toLocaleDateString("pt-BR", options);
}

document.getElementById("dataAtual").innerHTML = obterData();

//-----------------------------------------------------------------\\

//troca do icone do banco de dados (satatus da conexao)
//uso da api do preload.js
api.dbStatus((event, message) => {
  // teste de recebimento da mensagem
  console.log(message);
  if (message === "conectado") {
    document.getElementById("iconeDB").src = "../public/img/dbon.png";
  } else {
    document.getElementById("iconeDB").src = "../public/img/dboff.png";
  }
});

//=============================================================================
//==============================CRUD READ-inicio===============================

//passo 1- enviar ao main um pedido para listas as notas (apenas o main pode acessar o banco de dados)
api.listNotes();

//passo 5- recebimento das notas via IPC e renderizaçao (desenho) das notas no documento index.html
api.renderNotes((event, notes) => {
  const renderNotes = JSON.parse(notes); //json.parse converte de string para JSON
  console.log(renderNotes); // teste do passo 4
  //renderizar no index.html o conteudo do array
  arrayNotes = renderNotes; // atribui a variavel global (cmc do codigo) ao array
  //uso do laço forEach para percorrer o vetor e extrair os dados
  arrayNotes.forEach((n) => {
    //adiçao de tags <li> no documento index
    list.innerHTML += `
      <br>
      <li>
      <p>${n._id}</p>
      <p>${n.texto}</p>
      <p>${n.cor}</p>
      </li>
    `;
  });
});

//==============================CRUD READ-fim==================================
//=============================================================================
