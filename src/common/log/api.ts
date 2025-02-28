class Logger4 {
  private static instance: Logger4 | null = null
  private logger: any

  private constructor() {
    this.initLogger()
  }

  public static getInstance(): Logger4 {
    if (this.instance === null) {
      this.instance = new Logger4()
    }
    return this.instance
  }

  private getLogPath(): string {
    const path = require('path')
    // const { app } = require('electron')
    // const userDataPath = app.getPath('userData')
    if (import.meta.env.MODE === 'development') {
      // const devPath = path.join(userDataPath, 'logs')
      const devPath = '/Users/taoyecheng/logs/'
      return devPath
    } else {
      // 获取应用安装根目录（aoi_package 的父目录）
      const appRoot = path.dirname(process.resourcesPath)
      // 向上回退两级到 aoi_package 目录
      const aoiPackageRoot = path.join(appRoot, '..', '..')
      // 最终日志路径
      const proPath = path.join(aoiPackageRoot, 'log')
      console.log('proPath:', proPath)
      return proPath
    }
  }

  private initLogger() {
    const log4js = require('log4js')
    const path = require('path')
    const logPath = this.getLogPath()
    const fs = require('fs')
    // 确保目录存在
    if (!fs.existsSync(logPath)) {
      fs.mkdirSync(logPath, { recursive: true, mode: 0o777 })
    }
    try {
      // 配置 log4js，指定日志输出方式和文件存储设置
      log4js.configure({
        appenders: {
          // 控制台输出配置
          out: {
            type: 'console' // 日志输出到控制台
          },
          // 日志文件输出配置
          // 日志文件输出配置
          main: {
            type: 'file', // 使用文件类型的 appender
            filename: path.join(
              logPath,
              `aoi_hmi-${new Date().toISOString().replace(/[:.]/g, '-')}.log`
            ), // 日志文件的路径和名称，包含时间戳
            maxLogSize: 200 * 1024 * 1024,
            backups: 20, // 保留的日志文件备份数量
            mode: 0o777 // 文件权限模式
          }
        },
        categories: {
          // 默认的日志类别及其关联的 appenders 和日志级别
          default: {
            appenders: ['out', 'main'], // 同时输出到控制台和日志文件
            level: 'debug' // 日志级别为 debug，记录 debug 及以上级别的日志
          }
        }
      })
      // 获取名为 "main" 的 logger 实例
      this.logger = log4js.getLogger('main')
    } catch (err) {
      // 捕获并输出初始化日志系统时的错误
      console.error('initLogger error:', err)
    }
  }

  public info(message: string) {
    if (this.logger) {
      this.logger.info(message)
    } else {
      console.log('Logger not initialized:', message)
    }
  }

  public error(message: string) {
    if (this.logger) {
      this.logger.error(message)
    } else {
      console.log('Logger not initialized:', message)
    }
  }

  public warn(message: string) {
    if (this.logger) {
      this.logger.warn(message)
    } else {
      console.log('Logger not initialized:', message)
    }
  }

  public debug(message: string) {
    if (this.logger) {
      this.logger.debug(message)
    } else {
      console.log('Logger not initialized:', message)
    }
  }
}

export { Logger4 }
