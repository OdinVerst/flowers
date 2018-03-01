var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var spritesmith = require('gulp.spritesmith');
var del = require('del');
var fileinclude = require('gulp-file-include');

gulp.task('sass', function () {
    return gulp.src('./source/sccs/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./source/sccs/**/*.scss', ['sass']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});

gulp.task('sprite', function() {
    var spriteData =
        gulp.src('./source/img/sprite/*.*')
            .pipe(spritesmith({
                imgName: 'sprite.png',
                cssName: 'sprite.css',
            }));

    spriteData.img.pipe(gulp.dest('./build/images/'));
    spriteData.css.pipe(gulp.dest('./build/css/'));
});

// Clean
gulp.task('clean', function() {
    return del(['build/css', 'build/images']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('sass', 'browser-sync', 'sprite','watch','fileinclude');
});

gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('./source/sccs/**/*.scss', ['sass']);


    // Watch image files
    gulp.watch('./source/img/sprite/*.*', ['sprite']);
    gulp.watch('./source/*.html', ['fileinclude']);

});

gulp.task('fileinclude', function() {
    gulp.src(['source/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('build/'));
});