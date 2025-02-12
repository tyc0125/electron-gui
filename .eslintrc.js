module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@vue/eslint-config-prettier',
    'plugin:prettier/recommended' // 添加这一行
  ],
  rules: {
    'vue/require-default-prop': 'off', // 关闭 Vue 对于 props 默认值的要求
    'vue/multi-word-component-names': 'off', // 关闭 Vue 对组件命名必须包含多个单词的规则
    'vue/attribute-hyphenation': 'off', // 允许在模板中使用大写字母作为属性名，而不需要强制转换成小写字母
    'vue/v-on-event-hyphenation': 'off', // 允许在模板中使用大写字母作为事件绑定的属性名
    'prettier/prettier': [
      'error',
      {
        singleQuote: true, // 使用单引号代替双引号
        semi: false, // 语句末尾加分号
        printWidth: 120, // 每行代码最大长度为 120 个字符
        trailingComma: 'none', // 在可能的地方（对象、数组等）添加尾逗号
        bracketSpacing: false, // 对象字面量中的括号不加空格（例如：{a: 1}）
        tabWidth: 2
      }
    ]
  }
}
