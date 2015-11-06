var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

//all scss imported in site.scss, except page-specific stuff
var input = './web/scss/site.scss';
var watchFiles = ['./web/scss/**/*.scss', './web/materialize-src/sass/components/*.scss'];
var templateFiles = './app/Resources/views/**/*.twig';
var jsFiles= './web/js/**/*.js';
var output = './web/css/';

gulp.task('sass', function() {
    gulp.src(input)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(output))
        .pipe(browserSync.stream());
});

gulp.task('watch', function() {
    gulp.watch(watchFiles,['sass']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./web/"
        }
    });
});

gulp.task('serve', ['sass'], function() {

    browserSync.init({
        proxy: "localhost:8000"
    });

    gulp.watch(watchFiles, ['sass']);
    gulp.watch([templateFiles, jsFiles]).on('change', browserSync.reload);
});

//Watch task
gulp.task('default', ['watch']);