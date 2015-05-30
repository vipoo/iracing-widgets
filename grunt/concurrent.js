module.exports = {
  watch: ['watch:styles', 'webpack', 'watch:uglify', 'watch:express', 'watch:eslint', 'watch:specs'],
  options: {
    logConcurrentOutput: true
  }
};
