module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jspm', 'jasmine'],
    loadFiles: ['app/scripts/**/*.js'],
    files: [
      'test/**/*.spec.js'
    ],
    jspm: {
        config: "app/config.js",
        packages: "./app/jspm_packages/"
    },
    phantomjsLauncher: {
        // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
        exitOnResourceError: true
    }
  });
};
