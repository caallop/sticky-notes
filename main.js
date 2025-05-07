/**
 * processo de renderizaçao do documento: sobre.html
 * @author guilherme rosa lopes
 */

const {
  app,
  BrowserWindow,
  nativeTheme,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require("electron/main");

const noteModel = require("./src/models/Notes.js");

const path = require("node:path");

const { connectDB, disconnectDB } = require("./database.js");
const { disconnect } = require("node:process");

let win;
const createWindow = () => {
  nativeTheme.themeSource = "light";
  win = new BrowserWindow({
    width: 1110,
    height: 720,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  win.loadFile("./src/views/index.html");
};

function aboutWindow() {
  let about;
  nativeTheme.themeSource = "light";
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    about = new BrowserWindow({
      width: 320,
      height: 220,
      resizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }
  about.loadFile("./src/views/sobre.html");
  ipcMain.on("about-exit", () => {
    if (about) about.close();
  });
}

let note;
function noteWindow() {
  nativeTheme.themeSource = "light";
  const mainWindow = BrowserWindow.getFocusedWindow();
  if (mainWindow) {
    note = new BrowserWindow({
      width: 400,
      height: 270,
      autoHideMenuBar: true,
      resizable: true,
      minimizable: false,
      parent: mainWindow,
      modal: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });
  }
  note.loadFile("./src/views/nota.html");
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.on("db-connect", async (event) => {
    await connectDB();
    setTimeout(() => {
      event.reply("db-status", "connectad");
    }, 500);
  });
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", async () => {
  await disconnectDB();
});

app.commandLine.appendSwitch("log-level", "3");

const template = [
  {
    label: "Notas",
    submenu: [
      {
        label: "Criar nota",
        accelerator: "Ctrl+N",
        click: () => noteWindow(),
      },
      {
        type: "separator",
      },
      {
        label: "Sair",
        accelerator: "Alt+F4",
        click: () => app.quit(),
      },
    ],
  },
  {
    label: "Ferramentas",
    submenu: [
      {
        label: "Aplica zoom",
        role: "zoomIn",
      },
      {
        label: "Reduzir zoom",
        role: "zoomOut",
      },
      {
        label: "Restaurar o zoom padrão",
        role: "resetZoom",
      },
      {
        type: "separator",
      },
      {
        label: "Recarregar",
        role: "reload",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "Repositório",
        click: () =>
          shell.openExternal("https://github.com/caallop/sticky-notes.git"),
      },
      {
        label: "Sobre",
        click: () => aboutWindow(),
      },
    ],
  },
];
ipcMain.on("create-note", async (event, stickyNotes) => {
  try {
    const newNote = noteModel({
      texto: stickyNotes.textoNote,
      cor: stickyNotes.colorNote,
    });
    newNote.save();
    dialog
      .showMessageBox({
        type: "info",
        title: "aviso",
        message: "Nota adicionada com sucesso",
        buttons: ["OK"],
      })
      .then((result) => {
        if (result.response === 0) {
          event.reply("reset-form");
        }
      });
  } catch (error) {
    console.log(error);
  }
});

ipcMain.on("list-notes", async (event) => {
  try {
    const notes = await noteModel.find();
    event.reply("render-notes", JSON.stringify(notes));
  } catch (error) {}
});
ipcMain.on("update-list", () => {
  updateList();
});

function updateList() {
  if (win && !win.isDestroyed()) {
    win.webContents.send("main-reload");
  }
}

ipcMain.on("delete-note", async (event, id) => {
  const result = await dialog.showMessageBox(win, {
    type: "warning",
    title: "atenção!!",
    message:
      "tem certeza que deseja excluir esta nota? \n esta ação não podera ser desfeita.",
    buttons: ["Cancelar", "Excluir"],
  });
  if (result.response === 1) {
    try {
      const deleteNote = await noteModel.findByIdAndDelete(id);
      updateList();
    } catch (error) {
      console.log(error);
    }
  }
});
