module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    // 按需导入组件库
    ['transform-imports', {
      'vuetify': {
        'transform': 'vuetify/es5/components/${member}',
        'preventFullImport': true
      }
    }]
  ]
};
