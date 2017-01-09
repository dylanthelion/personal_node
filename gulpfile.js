var gulp   = require('gulp');
var tap = require('gulp-tap');
var fs = require('fs');

gulp.task('buildhtml', function() {
	gulp.src('public/html/*.html').pipe(gulp.dest('build/html'));
	gulp.src('public/html/*/transforms/*.html').pipe(gulp.dest('build/html'));
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

// Transform code in html

var escapeCharsMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (key) {
    return escapeCharsMap[key];
  });
}

function getCode(code) {
	var getMatch = code.substring(code.lastIndexOf("<code>")+6,code.lastIndexOf("</code>"));
	return escapeHtml(getMatch);
}

function insertNewCode(oldCode, transformedCode) {
	var parts = oldCode.split('<code>');
	var parts2 = parts[1].split('</code>');
	parts2[0] = transformedCode;
	return [parts[0], parts2.join('</code>')].join('<code>');
}

function insertInto(string, match, insert) {
	var parts = string.split(match);
	return parts.join(match + insert);
}

gulp.task('transform', function() {
	var codeTransformer = function(filename, dirname) {
		var fileContent = fs.readFileSync(filename).toString();
		var replacedContent = getCode(fileContent);
		fileContent = insertNewCode(fileContent, replacedContent);
		var path = insertInto(filename, dirname, 'transforms/');
    	var file = fs.closeSync(fs.openSync(path, 'w'));
    	fs.writeFileSync(path, fileContent);
    	var stream = fs.readFileSync(path);
		return stream;
	}
 
  gulp.src('public/html/csharp/*.html')
    .pipe(tap(function(file, t) {
    	var transform = codeTransformer(file.path, '/csharp/');
    	return stream;
    }));

    gulp.src('public/html/swift/*.html')
    .pipe(tap(function(file, t) {
    	var transform = codeTransformer(file.path, '/swift/');
    	return stream;
    }));

    gulp.src('public/html/aws/*.html')
    .pipe(tap(function(file, t) {
    	var transform = codeTransformer(file.path, '/aws/');
    	return stream;
    }));

    gulp.src('public/html/nodejs/*.html')
    .pipe(tap(function(file, t) {
    	var stream = codeTransformer(file.path, '/nodejs/');
    	return stream;
    }));
});