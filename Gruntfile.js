module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      all: [
        'public/stylesheets',
        '.sass-cache'
      ]
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'server/**/*.js'
      ]
    },
    compass: {
      all: {
        options: {
          sassDir: 'public/sass',
          cssDir: 'public/stylesheets',
          imagesDir: 'public/images',
          fontsDir: 'public/fonts',
          relativeAssets: true,
          force: true
        }
      }
    },
    watch: {
      files: ['public/sass/**/*'],
      tasks: ['compass:dev']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean','jshint','compass','watch']);
};
