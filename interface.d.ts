import { LOG_TYPE } from './src/common/log/index'

declare global {
  interface Window {
    electronAPI: IElectronAPI
    api: {
      Log4: (type: LOG_TYPE, value: string) => void
    }
  }
}
