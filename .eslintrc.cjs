module.exports = {
    // ... existing code ...
    extends: [
      // 确保这些基础配置在前
      'eslint:recommended',
      'plugin:vue/vue3-recommended',
      // 然后是你的自动导入配置
      './.eslintrc-auto-import.json'
    ],
    // ... existing code ...
  }