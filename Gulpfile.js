var gulp = require('gulp');
var sass = require('gulp-sass');

var input = './web/materialize-src/sass/*';
var output = './web/css/';

gulp.task('sass', function() {
    gulp.src(input)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(output))
});

//Watch task
gulp.task('default',function() {
    gulp.watch('sass/**/*.scss',['sass']);
});