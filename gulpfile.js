var gulp   = require('gulp')

gulp.task('buildhtml', function() {
	gulp.src('public/html/*').pipe(gulp.dest('build/html'));
});

gulp.task('build', ['buildhtml']);

gulp.task('watch', function() {
	gulp.watch('public/html/*.html', ['buildhtml']);
});