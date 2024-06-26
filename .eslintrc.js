module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    wx: true,
    uni: true,
    getCurrentPages: true, // 微信小程序内置
    Component: true, // 微信小程序内置
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential',
    'prettier',
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    'vue/multi-word-component-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unreachable': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'prefer-const': 'error',
    '@typescript-eslint/ban-ts-comment': 'warn',
    'no-empty': 'off',
  },
};
