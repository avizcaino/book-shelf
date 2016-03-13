var gulp = require('gulp');
var bundler = require('aurelia-bundler');
var bundles = require('../bundles.js');
var runSequence = require('run-sequence');

var config = {
  force: true,
  baseURL: '.',
  configPath: './config.js',
  bundles: bundles.bundles
};

gulp.task('bundle-files', ['unbundle', 'build'], function() {
  return bundler.bundle(config);
});

gulp.task('unbundle', function() {
  return bundler.unbundle(config);
});

gulp.task('bundle', function(callback){
  return runSequence(
    'bundle-files',
    'build-polymer',
    'clean-no-bundled',
    callback
  );
});