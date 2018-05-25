const electron = require('electron')
const url = require('url')
const path = require('path')

const {app, BrowserWindow, Menu, ipcMain} = electron

// SET env
process.env.NODE_ENV = ''

let mainWindow
let portsWindow
let deviceWasSelected = true

// Listen for app to be ready
app.on('ready', createPortsWindow)

function createPortsWindow() {
  // Create new window
  portsWindow = new BrowserWindow({
    // width: 350,
    // height: 340
    width: 800,
    height: 600
    // title: 'Seleccionar Dispositivo'
  });
  // Load html into window
  portsWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/dispositivo.html'),
    protocol: 'file',
    slashes: true
  }));
  // Garbage collection handle
  portsWindow.on('close', () => {
    addWindow = null
    if (deviceWasSelected) {
      createMainWindow()
    } else {
      app.quit()
    }
  })

  // Build menu from template
  const portsWindowMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert menu
  Menu.setApplicationMenu(portsWindowMenu)
}

function createMainWindow() {
  // Create new window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  });
  // Load html into window
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'public/index.html'),
    protocol: 'file',
    slashes: true
  }));

  // win.maximize()
  // Quit app when closed
  mainWindow.on('closed', () => {
    app.quit()
    mainWindow = null
  });

  // Build menu from template
  const mainWindowMenu = Menu.buildFromTemplate(mainMenuTemplate)
  // Insert menu
  Menu.setApplicationMenu(mainWindowMenu)
}

// Create menu template
const mainMenuTemplate = [
  {
    label: 'App',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click(){
          app.quit()
        }
      }
    ]
  }
]

if (process.env.NODE_ENV != 'production') {
  mainMenuTemplate.push({
    label: 'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: 'F12',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    ]
  })
}

// ---------------------------------------------------------------------------
const serialport = require('serialport')
const spReadline = serialport.parsers.Readline

let portList = {}

// list of all ports
serialport.list((error, ports) => {
  portList = ports
})

ipcMain.on('getPorts', (e) => {
  portsWindow.webContents.send('portList', portList)
})

ipcMain.on('selectedport', (e, data) => {
  console.log('port:', data)
  const port = new serialport(data, {
    baudRate: 115200
  })

  port.on('error', error => {
    console.log('ERROR', error)
    portsWindow.webContents.send('error', error)
  })

  port.on('open',() => {
    console.log('Serial Port Opened...')
    deviceWasSelected = true
    portsWindow.close()
    // createMainWindow()
  })

  port.on('close', error => {
    console.log('Serial Port Closed:', error)
  })

  const parser = new spReadline()
  port.pipe(parser)

  // Recibe los datos de arduino y los imprime
  parser.on('data', data => {
    var uid = data.replace(/\s|\r/g, '')
    mainWindow.webContents.send('deviceData', uid)
    // portsWindow.webContents.send('deviceData', uid)
    console.log('device data:', uid)
  })

  ipcMain.on('guardarNFC', (e, data) => {
    console.log('dato enviado al dispositivo:', data)
    port.write(data + "\n", err => {
      if (err) {
        return console.log('Error on write:', err.message)
      }
    })
  })
})
