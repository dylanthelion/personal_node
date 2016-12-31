var gulp   = require('gulp');

gulp.task('buildhtml', function() {
	gulp.src('public/html/*').pipe(gulp.dest('build/html'));
});

gulp.task('buildstyles', function() {
	gulp.src('public/styles/**/*').pipe(gulp.dest('build/styles'));
	/*gulp.src('public/styles/*').pipe(gulp.dest('build/styles'));*/
});

gulp.task('buildscripts', function() {
	gulp.src('public/js/*').pipe(gulp.dest('build/js'));
});

gulp.task('buildassets', function() {
	gulp.src('public/assets/*').pipe(gulp.dest('build/assets'));
});

gulp.task('build', ['buildhtml', 'buildstyles', 'buildscripts', 'buildassets']);

gulp.task('watch', function() {
	gulp.watch('public/html/*.html', ['buildhtml']);
});