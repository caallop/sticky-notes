/**
 *preload.js - usado no framework electron para umentar a segurança e o desempenho
 */

//perite estabelcer uma conexao entre processos, [main.js e renderer.js (lembrar da imagem do professor)]
//vamos usar para uma conexao de 2 vias
//coontextBridge: permissoes de comunicaçao entre processos usando a api do electron
const { ipcRenderer, contextBridge } = require("electron");
const Renderer = require("electron/renderer");

//enviar uma mensagem para o main.js estabelcer uma conexao com o banco de dados quando inciiar a apluicaçao
ipcRenderer.send("db-connect");

//permissao para estabelecer a comunicaçao
contextBridge.exposeInMainWorld("api", {
  dbStatus: (message) => ipcRenderer.on("db-status", message),
  aboutExit: () => ipcRenderer.send("about-exit"),
  createNote: (stickyNote) => ipcRenderer.send("create-note", stickyNote),
  resetForm: (args) => ipcRenderer.on('reset-form', args),
  listNotes: () => ipcRenderer.send('list-notes'),
  renderNotes:(notes) =>ipcRenderer.on('render-notes', notes),
});
