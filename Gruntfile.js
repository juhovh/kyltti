module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: [
        'webapp-build',
        'webapp/stylesheets',
        '.sass-cache'
      ]
    },
    compass: {
      dev: {
        options: {
          sassDir: 'webapp/sass',
          cssDir: 'webapp/stylesheets',
          imagesDir: 'webapp/images',
          fontsDir: 'webapp/fonts',
          relativeAssets: true,
          force: true
        }
      }
    },
    watch: {
      dev: {
        files: ['webapp/sass/**/*'],
        tasks: ['compass:dev']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean:build','compass:dev','watch:dev']);
}
