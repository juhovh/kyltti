module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      build: [
        'public/stylesheets',
        '.sass-cache'
      ]
    },
    compass: {
      dev: {
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
      dev: {
        files: ['public/sass/**/*'],
        tasks: ['compass:dev']
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['clean:build','compass:dev','watch:dev']);
}
