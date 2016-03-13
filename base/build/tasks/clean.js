var gulp = require('gulp');
var paths = require('../paths');
var del = require('del');
var vinylPaths = require('vinyl-paths');

// deletes all files in the output path
gulp.task('clean', function() {
  return gulp.src([paths.output])
    .pipe(vinylPaths(del));
});

gulp.task('clean-no-bundled', function(){
  return del([
    paths.output + '/**/*',
    '!' + paths.output + '/aurelia.js',
    '!' + paths.output + '/app-build.js',
    '!' + paths.output + '/polymer.html',
    '!' + paths.output + 'core',
    '!' + paths.output + 'core/cordova',
    '!' + paths.output + 'core/cordova/push-receiver.js',
    '!' + paths.output + 'core/cordova/auto-update.js',
    '!' + paths.output + '/main.js'
  ]);
})