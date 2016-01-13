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

gulp.task('sass', function(){
    return gulp.src('app/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('images', function(){
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('browser-sync', function(){
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('clean:dist', function(){
    return del.sync('dist');
});

gulp.task('cache:clear', function (callback) {
    return cache.clearAll(callback)
});

gulp.task('build', function (callback){
  runSequence('clean:dist', 
    ['sass', 'images'],
    callback
  )
});

gulp.task('default', ['serve'], function(){
    return;
});

gulp.task('serve', ['browser-sync', 'sass'], function(){
    gulp.watch('app/sass/**/*.scss', ['sass']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/scripts/**/*.js', browserSync.reload);
});

