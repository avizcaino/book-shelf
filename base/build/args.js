var yargs = require('yargs');

var argv = yargs.argv;
var validBumpTypes = 'major|minor|patch|prerelease'.split('|');
var bump = (argv.bump || 'patch').toLowerCase();
var validPlatformTypes = 'android|ios|windows'.split('|');
var platform = (argv.platform || 'android').toLowerCase();

if (validBumpTypes.indexOf(bump) === -1) {
  throw new Error('Unrecognized bump "' + bump + '".');
}

if (validPlatformTypes.indexOf(platform) === -1) {
  throw new Error('Unrecognized platform "' + platform + '".');
}

module.exports = {
  bump: bump,
  platform: platform,
  depth: parseInt(argv.depth || '0')
};
