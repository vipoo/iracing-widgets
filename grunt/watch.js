module.exports = {
  specs: {
    files: [ 'src/**/*.js', 'spec/**/*' ],
    tasks: [ 'specs' ],
    options: {
      atBegin: true
    }
  },
  express: {
    files: [ 'src/**/*.js' ],
    tasks: [ 'express:dev' ],
    options: {
      atBegin: true,
      livereload: 36729,
      spawn: false
    }
  },
  styles: {
    files: ['src/styles/**/*.less'],
    tasks: ['less'],
    options: {
      atBegin: true
    }
  },
  uglify: {
    files: ['src/js/**/*.js'],
    tasks: ['uglify'],
    options: {
      atBegin: true
    }
  },
  eslint: {
    files: ['**/*.js'],
    tasks: ['eslint'],
    options: {
      atBegin: true
    }
  }
};
