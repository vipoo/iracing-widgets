module.exports = {
  options: {
    includePaths: ['bower_components']
  },
  dist: {
    files: [{
      expand: true,
      cwd: 'src/styles',
      src: ['*.{scss,sass}'],
      dest: 'public/',
      ext: '.css'
    }]
  }
};
