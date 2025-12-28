module.exports = function (api) {
  api.cache(true);
  const nativewindBabel = require('nativewind/babel');
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ...nativewindBabel().plugins.filter(Boolean),
    ],
  };
};

