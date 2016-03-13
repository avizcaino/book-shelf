var gulp = require('gulp');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var notify = require("gulp-notify");
var typescript = require('gulp-tsb');
var to5 = require('gulp-babel');
var compilerOptions = require('../babel-options');
var exec = require('gulp-exec');

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
var typescriptCompiler = typescriptCompiler || null;
gulp.task('build-system', function() {
  if(!typescriptCompiler) {
    typescriptCompiler = typescript.create(require('../../tsconfig-es5.json').compilerOptions);
  }
  return gulp.src(paths.dtsSrc.concat(paths.source))
      .pipe(plumber())
    .pipe(changed(paths.output, {extension: '.js'}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(typescriptCompiler())
    .pipe(sourcemaps.write({includeContent: true}))
    .pipe(gulp.dest(paths.output));
});
/*gulp.task('build-system', function() {
  return gulp.src(paths.sourcejs)
      .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
      .pipe(changed(paths.output, {extension: '.js'}))
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(to5(assign({}, compilerOptions, {modules: 'system'})))
      .pipe(sourcemaps.write({includeContent: true}))
      .pipe(gulp.dest(paths.output));
});*/

// copies changed html files to the output directory
gulp.task('build-html', function() {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

// copies changed css files to the output directory
gulp.task('build-css', function() {
  return gulp.src(paths.css)
    .pipe(changed(paths.output, {extension: '.css'}))
    .pipe(gulp.dest(paths.output));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    'unbundle',
    ['build-system', 'build-html', 'build-css'],
    callback
  );
});

// build polymer
//vulcanize elements.html -o elements.vulcanize.html --csp --inline --strip
gulp.task('build-polymer', function(){
  var reportOptions = {
    err: true, // default = true, false means don't write err
    stderr: true, // default = true, false means don't write stderr
    stdout: true // default = true, false means don't write stdout
  }

  return gulp.src(paths.root + 'elements.html')
    .pipe(exec('vulcanize <%= file.path %> -o dist/polymer.html --inlineCss --inlineScripts --stripComments --'))
    .pipe(exec.reporter(reportOptions));
});
