var gulp = require('gulp');
var sass = require('gulp-sass');

//all scss imported in site.scss, except page-specific stuff
var input = './web/scss/site.scss';
var watchFiles = './web/scss/**/*.scss';
var output = './web/css/';

gulp.task('sass', function() {
    gulp.src(input)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(output))
});

gulp.task('watch', function() {
    gulp.watch(watchFiles,['sass']);
});

//Watch task
gulp.task('default', ['watch']);