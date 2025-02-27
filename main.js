console.log("electron processo principal")

const { app, BrowserWindow } = require('electron/main')
// importaçao dos recursos do framekwork
//app se refere a aplicaçao
//browsewindow (criaçao da janela)
const createWindow = () => {
  //janela principal
  let win
  win = new BrowserWindow({
    //1010
    width: 800,
    //720 (exemplos para mexer na altura e largura)
    height: 600,
    //dxa em tela cheia
    resizable: false, //mudar tamanho?
    minimizable: true, //minizavel?
    closable: true, //fechavel?
    fullscreen: false, //tela cheia?
    autoHideMenuBar: true, //menu bar escondida?
    frame: true, //tira TUDO
  })
//carrega o documento
  win.loadFile('./src/views/index.html')
}
//inicializaçao da aplicaçao (assincronismo)
app.whenReady().then(() => {
  createWindow()
//só ativar a janela se nenhuma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
//se o sistema não for mac, fechar as janelas quanto encerrar a aplicaçao quando a janeçla for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})