var appRoot = 'src/';
var outputRoot = 'dist/';
var exporSrvtRoot = 'export/'
var apkRoot = '../apk/';

module.exports = {
  root: appRoot,
  apkRoot: apkRoot,
  source: appRoot + '**/*.ts',
  sourcejs: appRoot + '**/*.js',
  html: appRoot + '**/*.html',
  css: appRoot + '**/*.css',
  style: 'styles/**/*.css',
  output: outputRoot,
  exportSrv: exporSrvtRoot,
  doc: './doc',
  e2eSpecsSrc: 'test/e2e/src/**/*.ts',
  e2eSpecsDist: 'test/e2e/dist/',
  dtsSrc: [
    './typings/browser/**/*.d.ts',
    './custom_typings/**/*.d.ts',
    './jspm_packages/**/*.d.ts'
  ]
}
