var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var KarmaServer = require('karma').Server;
var jspm =  require('gulp-jspm');
var inject =  require('gulp-inject');

var baseDir = 'app'

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest( baseDir + '/css'))
        .pipe(browserSync.stream())
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: baseDir,
            index: 'views/index.html'
        }
    });
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('test', function (callback) {
  new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
    }, function(exitStatus) { 
        callback(); 
        process.exit(exitStatus);
    }).start();
});

gulp.task('tdd', function (callback) {
    new KarmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, function(exitStatus) { 
        callback();
        process.exit(exitStatus);
    }).start();
});

gulp.task('bundle', function(){
    var bundleStream = gulp.src('app/scripts/app.js')
    .pipe(jspm({selfExecutingBundle: true}))
    .pipe(gulp.dest('dist/scripts/'));

    // Inject (and copy) html files.
    return gulp.src(['app/**/*.html', '!app/scripts/vendor/**'])
    .pipe(inject(bundleStream, {ignorePath: 'dist/'}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', function (callback){
  // Execute tasks for dist.
  baseDir = 'dist'
  runSequence('clean:dist', 
    ['sass', 'images', 'bundle'],
    callback
  )
});

gulp.task('default', ['serve'], function(){
    return;
});

gulp.task('serve', ['browser-sync', 'sass'], function(){
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch("app/**/*.html").on('change', browserSync.reload);
    gulp.watch("app/scripts/**/*.js").on('change', browserSync.reload);
});

gulp.task('serve:dist', ['build'], function(callback){
    runSequence('browser-sync');
});
