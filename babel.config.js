module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: ['nativewind/babel'], // Temporarily disabled to fix Babel error
  };
};
