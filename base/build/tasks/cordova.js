/**
 * Created by alexvizcaino on 10/3/16.
 */
var gulp = require('gulp');
var args = require('../args');
var paths = require('../paths');
var del = require('del');
var runSequence = require('run-sequence');
var exec = require('gulp-exec');
var rename = require('gulp-rename');

gulp.task('cordova-clean', function(){
    return del(paths.apkRoot + 'www/', {force: true});
});

gulp.task('rename-index', function(){
    return gulp.src(paths.exportSrv + '*.html')
        .pipe(rename(function (path) {
            if(path.basename == 'index')
                path.basename = 'mys';
            else if(path.basename == 'autoupdater')
                path.basename = 'index';
        }))
        .pipe(gulp.dest(paths.exportSrv));
});

gulp.task('prepare-apk', function(){
    // Copy export to apk root folder (www)
    return gulp.src(paths.exportSrv + '**/*')
        .pipe(gulp.dest(paths.apkRoot + 'www/'));
});

gulp.task('generate-manifest', function(){
    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };

    return gulp.src('../apk/')
        .pipe(exec('node ../apk/bin/update-manifest.js ../apk/www ../apk/www/manifest.json'))
        .pipe(exec.reporter(reportOptions));
})

gulp.task('run-device', function(){

    var reportOptions = {
        err: true, // default = true, false means don't write err
        stderr: true, // default = true, false means don't write stderr
        stdout: true // default = true, false means don't write stdout
    };

    return gulp.src('../apk/')
        .pipe(exec('cd ../apk/ && cordova run ' + args.platform))
        .pipe(exec.reporter(reportOptions));
});

gulp.task('cordova-run', function(callback){
    return runSequence(
        'cordova-clean',
        'export',
        'rename-index',
        'prepare-apk',
        'generate-manifest',
        'run-device',
        callback
    )
});