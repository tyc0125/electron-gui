const isWin32 = process.platform === 'win32'

module.exports = {
  appId: 'com.electron.app',
  productName: 'electron-vite-start',
  directories: {
    buildResources: 'build'
  },
  files: [
    '!**/.vscode/*',
    '!src/*',
    '!{electron.vite.config.mjs,electron-builder.config.js}',
    '!{.eslintignore,.eslintrc.js,.prettierignore,.prettierrc.js,dev-app-update.yml,CHANGELOG.md,README.md}',
    '!{.env,.env.*,.npmrc,pnpm-lock.yaml}'
  ],
  asarUnpack: ['resources/**'],
  electronLanguages: isWin32 ? ['en', 'zh-TW', 'zh-CN', 'en-US', 'en-GB'] : ['en', 'zh_TW', 'zh_CN', 'en_US', 'en_GB'],
  win: {
    icon: 'build/icon.ico',
    target: [{ target: 'nsis', arch: ['x64'] }],
    executableName: 'electron-vite-start'
  },
  nsis: {
    artifactName: '${name}-${os}-${arch}-${version}-setup.${ext}',
    shortcutName: '${productName}',
    uninstallDisplayName: '${productName}',
    createDesktopShortcut: 'always',
    oneClick: false, // 设置为 false 以提供安装类型选择界面，允许用户选择是否创建桌面图标，允许用户选择安装路径 //
    perMachine: true, // 设置为 true 将使安装程序默认为所有用户安装应用，这需要管理员权限 //
    allowToChangeInstallationDirectory: true, // 如果设置为 true，安装程序将允许用户更改安装目录 //
    allowElevation: true, // 一般情况下，此字段不会被直接使用，权限提升主要依赖于 perMachine 的设定。当perMachine为true，安装程序会请求管理员权限 //
    deleteAppDataOnUninstall: true, // 如果设置为 true，卸载程序将删除AppData中的所有程序数据 //
    createStartMenuShortcut: true // 如果设置为 true，安装程序将在开始菜单中创建程序快捷方式 //
  },
  mac: {
    type: 'development',
    icon: 'build/icon.icns',
    identity: null,
    hardenedRuntime: false,
    target: [
      {
        target: 'dmg', // dmg、pkg、mas、mas-dev //
        arch: ['universal'] // 'x64', 'arm64', 'universal' //
      }
    ],
    // // #region //
    // // fix: that's the same in both x64 and arm64 builds and not covered by the x64ArchFiles rule: "undefined" //
    // mergeASARs: false, //
    // singleArchFiles: "*", //
    // x64ArchFiles: "*", //
    // // #endregion //
    entitlementsInherit: 'build/entitlements.mac.plist',
    extendInfo: {
      NSCameraUsageDescription: "Application requests access to the device's camera.",
      NSMicrophoneUsageDescription: "Application requests access to the device's microphone.",
      NSDocumentsFolderUsageDescription: "Application requests access to the user's Documents folder.",
      NSDownloadsFolderUsageDescription: "Application requests access to the user's Downloads folder."
    },
    notarize: false
  },
  dmg: {
    artifactName: '${name}-${os}-${arch}-${version}.${ext}'
  },
  linux: {
    target: ['AppImage', 'snap', 'deb'],
    maintainer: '',
    category: 'Utility'
  },
  appImage: {
    artifactName: '${name}-${os}-${arch}-${version}.${ext}'
  },
  npmRebuild: false,
  publish: {
    provider: 'generic',
    url: ''
  },
  electronDownload: {
    mirror: 'https://npmmirror.com/mirrors/electron/'
  }
}
