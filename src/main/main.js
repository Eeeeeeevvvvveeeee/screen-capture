const {app , BrowserWindow, ipcMain, screen, desktopCapturer, shell, Tray, Menu} = require("electron")
const path = require("node:path")
const fs = require("node:fs")
const os = require("node:os")

// Is app ready and initialised ? show the app window
app.whenReady().then(() => {
    const window = new BrowserWindow({
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        },
        frame: false,
        transparent: true
    })
    const iconPath = path.join(__dirname, "../../assets/camera.png")
    const tray = new Tray(iconPath)
    tray.on("click", ()=>{
        if(window.isVisible()) {
            window.hide()
        } else {
            window.show()
        }
    })

    const menuTemplate = [
        {
            label: "Quit",
            click: () => {
                app.quit()
            }
        }
    ]

    const contextMenu = Menu.buildFromTemplate(menuTemplate)
    tray.setContextMenu(contextMenu)


    window.loadFile(path.join(__dirname, '../render/index.html'))

    ipcMain.on("window-minimize", () => window.minimize())
    ipcMain.on("window-maximize", () => {
        if (window.isMaximized()) window.unmaximize()
        else window.maximize()
    })
    ipcMain.on("window-close", () => window.hide())

    ipcMain.on("capture-screen", async () => {
        const screenSize = screen.getPrimaryDisplay().workAreaSize;
        const screens = await desktopCapturer.getSources({
            types: ["screen"],
            thumbnailSize: {
                width: screenSize.width,
                height: screenSize.height
            }
        })

        const img = screens[0].thumbnail.toPNG();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const fileName = `screenshot-${timestamp}.png`
        const filePath = path.join(os.homedir(),fileName)

        fs.writeFile(filePath, img, (err) => {
            shell.openExternal(`file://${filePath}`)
        })

    })
})


