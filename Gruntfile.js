process.env.NODE_PATH = __dirname + '/src:'
require('module').Module._initPaths()
require('lib/babel')
require('lib/logger')

module.exports = function(grunt) {

  require('load-grunt-config')(grunt)

  grunt.registerTask('assets', 'Build css/js assets', ['less', 'webpack:dev', 'uglify'])
  grunt.registerTask('test', 'Run all the mochaTests under node', ['mochaTest'])
  grunt.registerTask('serve', 'Run tests and start web server', [ 'concurrent' ])
  grunt.registerTask('default', 'Run tests and start web server',  [ 'serve' ])

}
