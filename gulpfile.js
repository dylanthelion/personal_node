var gulp   = require('gulp');
var tap = require('gulp-tap');
var fs = require('fs');
var del = require('del');
var path = require('path');

gulp.task('buildhtml', function() {
	gulp.src('public/html/**/*.ejs').pipe(gulp.dest('build/html'));
	gulp.src('public/html/*/transforms/*.ejs').pipe(gulp.dest('build/html'));
});

gulp.task('cleanhtml', function() {
	return del([
    	'build/html/**/*.ejs',
    	'public/html/*/transforms/*.ejs'
  	]);
})

gulp.task('buildstyles', function() {
	gulp.src('public/styles/**/*').pipe(gulp.dest('build/styles'));
});

gulp.task('cleanstyles', function() {
	return del([
    	'build/styles/**/*.css'
  	]);
})

gulp.task('buildscripts', function() {
	gulp.src('public/js/*').pipe(gulp.dest('build/js'));
});

gulp.task('cleanscripts', function() {
	return del([
    	'build/js/**/*.js'
  	]);
})

gulp.task('buildassets', function() {
	gulp.src('public/assets/*').pipe(gulp.dest('build/assets'));
});

gulp.task('cleanassets', function() {
	return del([
    	'build/assets/**/*'
  	]);
})

gulp.task('build', ['buildhtml', 'buildstyles', 'buildscripts', 'buildassets']);

gulp.task('watch', function() {
	//gulp.watch('public/html/*.html', ['buildhtml']);
	gulp.watch('public/html/*.ejs', ['buildhtml']);
});

gulp.task('clean', ['cleanhtml', 'cleanscripts', 'cleanstyles', 'cleanassets']);

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

function getLinks(html) {
	return html.substring(html.lastIndexOf("<links>")+7,html.lastIndexOf("</links>"));
}

function getTitle(html) {
	return html.substring(html.lastIndexOf("<title>")+7,html.lastIndexOf("</title>"));
}

function insertNewCode(oldCode, transformedCode, firstMatch, secondMatch) {
	var parts = oldCode.split(firstMatch);
	var parts2 = parts[1].split(secondMatch);
	parts2[0] = transformedCode;
	return [parts[0], parts2.join(secondMatch)].join(firstMatch);
}

function insertInto(string, match, insert) {
	var parts = string.split(match);
	return parts.join(match + insert);
}

function createLink(title, filename, dirname) {
	return '<a href="http://localhost:8085/' + dirname + '/' + filename + '">' + title + '</a>';
}

gulp.task('transform', function() {
	var codeTransformer = function(filename, dirname) {
		var fileContent = fs.readFileSync(filename).toString();
		var replacedContent = getCode(fileContent);
		fileContent = insertNewCode(fileContent, replacedContent, '<code>', '</code>');
		var path = insertInto(filename, dirname, 'transforms/');
    	var file = fs.closeSync(fs.openSync(path, 'w'));
    	fs.writeFileSync(path, fileContent);
    	var stream = fs.readFileSync(path);
		return stream;
	}

	var linksTransformer = function(filepath, dirname, indexFilePath) {
		var fileContent = fs.readFileSync(indexFilePath).toString();
		var filename = path.basename(filepath).slice(0, -4);
		var replacedContent = getLinks(fileContent);
		if (dirname == '') {
			fileContent = insertNewCode(fileContent, '  ', '<links>', '</links>');
		} else {
			var titleContent = fs.readFileSync(filepath).toString();
			var addLink = createLink(getTitle(titleContent), filename, dirname)
			fileContent = insertNewCode(fileContent, replacedContent + addLink, '<links>', '</links>');
		}
		fs.truncateSync(indexFilePath, 0);
		fs.writeFileSync(indexFilePath, fileContent);
	}

	linksTransformer('public/html/nodejs.ejs', '', '/Users/dillion/Desktop/Personal_Site_Node/public/html/nodejs.ejs');

	linksTransformer('public/html/csharp.ejs', '', '/Users/dillion/Desktop/Personal_Site_Node/public/html/csharp.ejs');

	linksTransformer('public/html/aws.ejs', '', '/Users/dillion/Desktop/Personal_Site_Node/public/html/aws.ejs');

	linksTransformer('public/html/swift.ejs', '', '/Users/dillion/Desktop/Personal_Site_Node/public/html/swift.ejs');
 
  gulp.src('public/html/csharp/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'csharp', '/Users/dillion/Desktop/Personal_Site_Node/public/html/csharp.ejs');
    	var stream = codeTransformer(file.path, '/csharp/');
    	return stream;
    }));

    gulp.src('public/html/swift/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'swift', '/Users/dillion/Desktop/Personal_Site_Node/public/html/swift.ejs');
    	var stream = codeTransformer(file.path, '/swift/');
    	return stream;
    }));

    gulp.src('public/html/aws/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'aws', '/Users/dillion/Desktop/Personal_Site_Node/public/html/aws.ejs');
    	var stream = codeTransformer(file.path, '/aws/');
    	return stream;
    }));

    gulp.src('public/html/nodejs/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'nodejs', '/Users/dillion/Desktop/Personal_Site_Node/public/html/nodejs.ejs');
    	var stream = codeTransformer(file.path, '/nodejs/');
    	return stream;
    }));
});