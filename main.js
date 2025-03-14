/**
 *
 *
 */
 
console.log("Hello Electron! Processo Principal.")
 
 
// FINAL STARTER CODE  - Importação dos recursos do framework
// app (aplicação)
// BrowserWindow (criação da janela)
// nativeTheme (definir tema claro ou escuro)
// Menu (Definir um menu personalizado)
// shell (acessar links externos no navegador padrão)
const { app, BrowserWindow, nativeTheme, Menu, shell } = require('electron/main')
 
// Janela principal
let win
const createWindow = () => {
  // definindo o tema da janela claro ou escuro
  nativeTheme.themeSource = 'light'
  win = new BrowserWindow({
    width: 1010,
    height: 720
    // frame = menu padrão do electro, da p tirar e fazer na mão p personalizar com cores fora do padrão (preto/branco)
    // frame: false
    //
    // resizable: false,
    // minimizable: false,
    // closable: false,
    // autoHideMenuBar: true
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
      height: 280,
      autoHideMenuBar: true,
      resizable: false,
      minimizable: false,
      // Estabelecer uma relação hierarquica entre janelas
      parent: mainWindow,
      // Criar uma janela modal (só retorna a principal quando encerrada)
      modal:true
 
    })
  }
 
  about.loadFile('./src/views/sobre.html')
}
 
// inicialização da aplicação (assincronismo)
app.whenReady().then(() => {
  createWindow()
 
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
        role:'reload'
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
 