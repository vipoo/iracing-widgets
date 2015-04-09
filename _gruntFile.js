function defineTasks(tasks) {
  var grunt = this;

  function addTask(t, tasks) {
    grunt.registerTask(t, function(target) { grunt.task.run(tasks)});
  }

  for( var t in tasks) {
    if( tasks.hasOwnProperty(t)) {
      addTask(t, tasks[t]);
    }
  }
}

module.exports = function(grunt) {

  grunt.defineTasks = defineTasks;

  require('load-grunt-config')(grunt);

  grunt.defineTasks({
    'serve':    [ 'concurrent' ],
    'default':  [ 'concurrent' ],
  });

  require('lib/babel');

  grunt.registerTask('specs', function() {
    var Jasmine = require('./node_modules/jasmine/lib/jasmine.js');
    var jasmine = new Jasmine();

    process.env.NODE_PATH = process.env.NODE_PATH + ":" + __dirname + '/spec';
    require('module').Module._initPaths();

    jasmine.loadConfigFile(process.env.JASMINE_CONFIG_PATH);
    jasmine.configureDefaultReporter({
      showColors: true,
      onComplete: this.async()
    });
    jasmine.execute();
  })
};
