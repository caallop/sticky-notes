
console.log("Hello Electron! Processo Principal.")


//const { ipcMain } = require('electron')
// FINAL STARTER CODE  - Importação dos recursos do framework
// app (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (Definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
//ipcMain(permite estabelcer uma comunicaçao entre processos (Ipc) main.js <==> renderer.js )
const { app, BrowserWindow, nativeTheme, Menu, shell, ipcMain } = require('electron/main')

//importaçao do modelo de dados(das notes.js)
const noteModel = require ('./src/models/Notes.js')

//ativaçao do preload.js (importaçao do path)
const path = require('node:path')

//importaçao dos metodos conectar e desconectar
const { conectar, desconectar } = require('./database.js')


// Janela principal
let win
const createWindow = () => {
  // definindo o tema da janela claro ou escuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 710,
    height: 520,
    // frame = menu padrão do electro, da p tirar e fazer na mão p personalizar com cores fora do padrão (preto/branco)
    // frame: false
    //
    // resizable: false,
    // minimizable: false,
    // closable: false,
    // autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // Carregar o menu personalizado
  // ATENÇÃO: Antes importar o recurso Menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))

  // Carregar o documento html na janela
  win.loadFile('./src/views/index.html')
}

// Janela Sobre
let about
function aboutWindow() {
  nativeTheme.themeSource = 'light'

  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()

  //validação (se existir a janela principal)
  if (mainWindow) {

    about = new BrowserWindow({
      width: 320,
      height: 220,
      //autoHideMenuBar: true,
      //resizable: false,
      //minimizable: false,
      // Estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }


    })
  }



  about.loadFile('./src/views/sobre.html')
  //recebimento da mensagem do renderizador da tela sobre para fechar a janela usando um botao
  ipcMain.on('about-exit', () => {
    if (about)

      //validaçao se ja existir a janela e ela nao estiver sido destruida, fechar
      about.close()
  })

}

// Janela Sobre
let note
function noteWindow() {
  nativeTheme.themeSource = 'light'
  // Obter a janela principal
  const mainWindow = BrowserWindow.getFocusedWindow()
  //validação (se existir a janela principal)
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      resizable: true,
      minimizable: false,
      // Estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
  }
  note.loadFile('./src/views/nota.html')
}
// inicialização da aplicação (assincronismo)
app.whenReady().then(() => {
  createWindow()
  //melhor local para estabelcer a conexao com o banco de daods (esta entre criar a janela e conectar o bacno de dados)
  //no mongoDB, é mais eficiente mante uma unica conexao aberta durante todo o tempo de vida do aplicativo, e fechar a conecxao e encerrar a conexao com quando o aplicativo for finalizado
  //ipc.on (Receber as mensagens)
  //db-connect (rotulo da mensagen)
  ipcMain.on('db-connect', async (event) => {
    //a linha abaixo estabelece a conexao com o banco de dados
    await conectar()
    //enviar ao renderizador uma mensagem para trocar de imagem do icone de status do banco de dados (criar um dlay de 0.5 ou 1 seg para sincronizaçao com a nuvem)
    setTimeout(() => {
      event.reply('db-status', "conectado")
    }, 500) //500ms = 0.5 seg
  })
  // Só ativar a janela principal se nenuhma outra estiver ativa
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})
// Se o sistema não for MAC encerrar a aplicação quando a janela for fechada
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
//criar um recurso para encerrar a conexao com banco de dados quando for fechado
app.on('before-quit', async () => {
  await desconectar()
})
// Reduzir a verbozidade de logs não críticos (devtools)
app.commandLine.appendSwitch('log-level', '3')






// ================================
// Template do menu
const template = [
  {
    label: 'Notas',
    submenu: [
      {
        label: 'Criar nota',
        // tecla de atalho
        accelerator: 'Ctrl+N',
        click: () => noteWindow()
        // "função"
        //click: () => console.log("teste")
      },
      {
        type: 'separator'
      },
      {
        label: 'Sair',
        accelerator: 'Alt+F4',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'Ferramentas',
    submenu: [
      {
        label: 'Aplica zoom',
        role: 'zoomIn'
      },
      {
        // verificar funcionalidade com professor
        label: 'Reduzir zoom',
        role: 'zoomOut'
      },
      {
        label: 'Restaurar o zoom padrão',
        role: 'resetZoom'
      },
      {
        type: 'separator'
      },
      {
        label: 'Recarregar',
        role: 'reload'
      },
      {
        label: 'DevTools',
        role: 'ToggleDevTools'
      }
    ]
  },
  {
    label: 'Ajuda',
    submenu: [
      {
        label: 'Repositório',
        click: () => shell.openExternal('https://github.com/vitorapassos/stickynotes.git')
      },
      {
        label: 'Sobre',
        click: () => aboutWindow()
      }
    ]
  }
]

//====================================================
// CRUD create-inicio=================================

//RECEBIMENTO DO OBJETO QUE CONTEM OS DADOS DA NOTA
ipcMain.on('create-note', async(event, stickyNotes)=> {
  //IMPORTANTE- TESTE DE RECEBIMENTO DO OBJETO --- !!!SEMPRE FAZER!!!
  //passo 2
  console.log(stickyNotes)
  //criar uma nova estrutura de dados para salvar no banco de dados
  //ATENÇAO!!!! os atrubutos da estrutura precisam ser identicos ao modelo e os valores sao obtidos atraves do objeto stickynotes
  const newNote = noteModel({
    texto: stickyNotes.textoNote,
    cor: stickyNotes.colorNote
  })
  newNote.save()
})


// CRUD create-fim=================================
//====================================================
