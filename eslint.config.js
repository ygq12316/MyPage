import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**', 
      '**/*.min.js',      // 忽略所有压缩文件
      '**/assets/js/**',  // 忽略 assets/js 目录
      '**/vendor/**',
      '**/public/js/anime.min.js',
      '**/public/js/fireworks.js', 
      '**/public/live2d-widget/**'
    ]
  },
  js.configs.recommended,
  ...compat.config({
    env: {
      browser: true,
      node: true,
      es6: true
    },
    rules: {
      'no-console': 'error',
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="this"][callee.property.name="log"]',
          message: 'this.log 不应该存在于生产代码中'
        },
        {
          selector: 'CallExpression[callee.object.name="console"][callee.property.name=/^(log|info|warn|error|debug)$/]',
          message: 'console 方法不应该存在于生产代码中'
        }
      ]
    }
  })
];