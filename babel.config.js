module.exports = {
  presets: [
    //using loose true because of this issue: https://github.com/storybookjs/storybook/issues/12093
    ['@babel/preset-env', { loose: true }],
    '@babel/preset-react',
    '@babel/preset-flow',
    '@babel/preset-typescript',
  ],
  plugins: [['@babel/plugin-transform-class-properties', { loose: true }]],
};
