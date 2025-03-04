import { app, shell, BrowserWindow, ipcMain, protocol, IpcMainEvent } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { promises as fs } from 'fs'
import { LOG_PARAMS, Log4 } from '../common/log'

// 注册自定义协议方案为特权协议。
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'local-resource', // 要注册的自定义协议方案。
    privileges: {
      secure: true, // 将自定义协议视为安全的，类似于https。
      supportFetchAPI: true, // 允许在该协议上使用Fetch API。
      standard: true, // 将使用此协议的URL视为标准的HTTP(S)URL。
      bypassCSP: true, // 允许协议绕过内容安全策略（CSP）检查。
      stream: true // 启用对响应的流支持。
    }
  }
])

let mainWindow: BrowserWindow | null = null
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    initIpc(mainWindow)
  })

  mainWindow.on('closed', function () {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// 检查是否已经有其他实例在运行
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  // 如果未获取到锁，说明已有另一个实例在运行，因此退出应用
  app.quit()
} else {
  // 如果获取到了锁，继续执行以下代码
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // 当第二个实例启动时，这里会被触发
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0 || mainWindow === null) createWindow()
  })

  function convertPath(originalPath) {
    // 检测路径是否以斜杠开头，且之后是单个字母（盘符）跟着一个冒号
    const match = originalPath.match(/^\/([a-zA-Z])\/(.*)$/)
    if (match) {
      // 如果匹配，重构路径为 Windows 格式
      return `${match[1]}:/${match[2]}`
    } else {
      // 如果不匹配，返回原始路径
      return originalPath
    }
  }
  // 使用自定义的"local-resource"协议处理请求。
  protocol.handle('local-resource', async (request) => {
    // 解码请求URL，去掉协议部分，以获得原始路径。
    // 这里使用正则表达式将"local-resource:/"替换为空字符串，并解码URL编码。
    const decodedUrl = decodeURIComponent(
      request.url.replace(new RegExp(`^local-resource:/`, 'i'), '')
    )

    // 打印解码后的URL，以便调试。
    console.log('decodedUrl', decodedUrl)

    // 根据操作系统平台，可能需要转换路径格式。
    // 如果是Windows平台，调用convertPath方法转换路径；否则，直接使用解码后的URL。
    const fullPath = process.platform === 'win32' ? convertPath(decodedUrl) : decodedUrl

    // 打印最终的文件路径，以便调试。
    console.log('fullPath', fullPath)

    // 异步读取文件内容。
    const data = await fs.readFile(fullPath)

    // 将读取的文件内容封装在Response对象中返回。
    // 这允许Electron应用加载和显示来自自定义协议URL的内容。
    return new Response(data)
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
const initIpc = (winodws: BrowserWindow | null) => {
  ipcMain.on('Log4', (event: IpcMainEvent, arg: LOG_PARAMS) => {
    const { type, value } = arg
    switch (type) {
      case 'info':
        Log4.info(value)
        break
      case 'error':
        Log4.error(value)
        break
      case 'warn':
        Log4.warn(value)
        break
      case 'debug':
        Log4.debug(value)
        break
      default:
        console.log('Unknown log type:', type, ...value)
        break
    }
  })
}
