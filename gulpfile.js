var gulp   = require('gulp');
var tap = require('gulp-tap');
var fs = require('fs');
var del = require('del');
var path = require('path');

// There does not seem to be any good way to check the env in gulp, which makes sense, because there is no server or environment, yet, necessarily. The options I've found, all involve installing a module that allows you to set a system global and check it, which seems dumber and maybe less secure than having lines like this in a handful of pre-build files.

var serverVars = require('./environment/devVars.json');
//var serverVars = require('./environment/prodVars.json');*/

// vars loaded from env files. Should be env dependent.
var publicHtmlPath = serverVars.htmlPathPublic;
var buildHtmlPath = serverVars.htmlPathBuild;
var publicStylesPath = serverVars.cssPathPublic;
var buildStylesPath = serverVars.cssPathBuild;
var publicScriptsPath = serverVars.scriptsPathPublic;
var buildScriptsPath = serverVars.scriptsPathBuild;
var publicAssetsPath = serverVars.assetsPathPublic;
var buildAssetsPath = serverVars.assetsPathBuild;
var domain = serverVars.domain;
var appPath = serverVars.absoluteAppPath;

gulp.task('buildhtml', function() {
	gulp.src(publicHtmlPath + '/**/*.ejs').pipe(gulp.dest(buildHtmlPath));
	gulp.src(publicHtmlPath + '/*/transforms/*.ejs').pipe(gulp.dest(buildHtmlPath));
});

gulp.task('cleanhtml', function() {
	return del([
    	buildHtmlPath + '/**/*.ejs',
    	publicHtmlPath + '/*/transforms/*.ejs'
  	]);
})

gulp.task('buildstyles', function() {
	gulp.src(publicStylesPath + '/**/*').pipe(gulp.dest(buildStylesPath));
});

gulp.task('cleanstyles', function() {
	return del([
    	buildStylesPath + '/**/*.css'
  	]);
})

gulp.task('buildscripts', function() {
	gulp.src(publicScriptsPath + '/*').pipe(gulp.dest(buildScriptsPath));
});

gulp.task('cleanscripts', function() {
	return del([
    	buildScriptsPath + '/**/*.js'
  	]);
})

gulp.task('buildassets', function() {
	gulp.src(publicAssetsPath + '/*').pipe(gulp.dest(buildAssetsPath));
});

gulp.task('cleanassets', function() {
	return del([
    	buildAssetsPath + '/**/*'
  	]);
})

gulp.task('build', ['buildhtml', 'buildstyles', 'buildscripts', 'buildassets']);

gulp.task('watch', function() {
	gulp.watch(publicHtmlPath + '/*.ejs', ['buildhtml']);
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
	return '<a href="' + domain + dirname + '/' + filename + '">' + title + '</a>';
}

gulp.task('transform', function() {
	console.log(appPath);
	console.log(publicHtmlPath);
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

	linksTransformer(publicHtmlPath + '/nodejs.ejs', '', appPath + publicHtmlPath + '/nodejs.ejs');

	linksTransformer(publicHtmlPath + '/csharp.ejs', '', appPath + publicHtmlPath + '/csharp.ejs');

	linksTransformer(publicHtmlPath + '/aws.ejs', '', appPath + publicHtmlPath + '/aws.ejs');

	linksTransformer(publicHtmlPath + '/swift.ejs', '', appPath + publicHtmlPath + '/swift.ejs');
 
  gulp.src(publicHtmlPath + '/csharp/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'csharp', appPath + publicHtmlPath + '/csharp.ejs');
    	var stream = codeTransformer(file.path, '/csharp/');
    	return stream;
    }));

    gulp.src('public/html/swift/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'swift', appPath + publicHtmlPath + '/swift.ejs');
    	var stream = codeTransformer(file.path, '/swift/');
    	return stream;
    }));

    gulp.src('public/html/aws/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'aws', appPath + publicHtmlPath + '/aws.ejs');
    	var stream = codeTransformer(file.path, '/aws/');
    	return stream;
    }));

    gulp.src('public/html/nodejs/*.ejs')
    .pipe(tap(function(file, t) {
    	var link = linksTransformer(file.path, 'nodejs', appPath + publicHtmlPath + '/nodejs.ejs');
    	var stream = codeTransformer(file.path, '/nodejs/');
    	return stream;
    }));
});