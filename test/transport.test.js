'use strict';

require('should');
var fs = require('fs');
var join = require('path').join;
var gulp = require('gulp');
var utility = require('utility');
var Package = require('father').SpmPackage;
var base = join(__dirname, 'fixtures');
var transport = require('../lib/transport');
var util = require('../lib/util');

describe('Transport', function() {

  // https://github.com/popomore/gulp-transport/issues/5
  describe('include', function() {

    it('self', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'self'}))
      .on('data', function(file) {
        assert(file, 'transport-include-self.js');
      })
      .on('end', done);
    });

    it('self with ignore', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'self', ignore: ['b']}))
      .on('data', function(file) {
        assert(file, 'transport-include-self-ignore.js');
      })
      .on('end', done);
    });

    it('self with css', function(done) {
      var pkg = getPackage('js-require-css');

      var opt = {
        cwd: join(base, 'js-require-css'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'self'}))
      .on('data', function(file) {
        assert(file, 'transport-include-self-css.js');
      })
      .on('end', done);
    });

    it('relative', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'relative'}))
      .on('data', function(file) {
        assert(file, 'transport-include-relative.js');
      })
      .on('end', done);
    });


    it('relative with ignore', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'relative', ignore: ['b']}))
      .on('data', function(file) {
        assert(file, 'transport-include-relative-ignore.js');
      })
      .on('end', done);
    });

    it('relative with css', function(done) {
      var pkg = getPackage('js-require-css');

      var opt = {
        cwd: join(base, 'js-require-css'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'relative'}))
      .on('data', function(file) {
        assert(file, 'transport-include-relative-css.js');
      })
      .on('end', done);
    });

    it('relative with css ignore', function(done) {
      var pkg = getPackage('js-require-css');

      var opt = {
        cwd: join(base, 'js-require-css'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'relative', ignore: ['import-style']}))
      .on('data', function(file) {
        assert(file, 'transport-include-relative-css-ignore.js');
      })
      .on('end', done);
    });

    it('all', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'all'}))
      .on('data', function(file) {
        assert(file, 'transport-include-all.js');
      })
      .on('end', done);
    });

    it('all with ignore', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'all', ignore: ['b']}))
      .on('data', function(file) {
        assert(file, 'transport-include-all-ignore.js');
      })
      .on('end', done);
    });

    it('all with ignore2', function(done) {
      var pkg = getPackage('js-require-js');

      var opt = {
        cwd: join(base, 'js-require-js'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'all', ignore: ['c']}))
      .on('data', function(file) {
        assert(file, 'transport-include-all-ignore2.js');
      })
      .on('end', done);
    });

    it('all with css', function(done) {
      var pkg = getPackage('js-require-css');

      var opt = {
        cwd: join(base, 'js-require-css'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, include: 'all'}))
      .on('data', function(file) {
        assert(file, 'transport-include-all-css.js');
      })
      .on('end', done);
    });

  });

  describe('rename', function() {

    it('rename with debug', function(done) {
      var pkg = getPackage('type-transport');

      var opt = {
        cwd: join(base, 'type-transport'),
        cwdbase: true
      };

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, rename: {suffix: '-debug'}}))
      .on('data', function(file) {
        util.winPath(file.originPath).should.include('type-transport/index.js');
        util.winPath(file.path).should.include('type-transport/index-debug.js');
        assert(file, 'transport-rename-debug.js');
      })
      .on('end', done);
    });

    it('rename with hash', function(done) {
      var pkg = getPackage('transport-hash');

      var opt = {
        cwd: join(base, 'transport-hash'),
        cwdbase: true
      };

      function rename(file) {
        var hash = utility.sha1(fs.readFileSync(file.origin)).substring(0,8);
        file.basename += '-' + hash;
        return file;
      }

      gulp.src('index.js', opt)
      .pipe(transport({pkg: pkg, rename: rename}))
      .on('data', function(file) {
        util.winPath(file.originPath).should.include('transport-hash/index.js');
        util.winPath(file.path).should.include('transport-hash/index-8951f677.js');
        assert(file, 'transport-rename-hash.js');
      })
      .on('end', done);
    });

    it('rename with css', function(done) {
      var pkg = getPackage('css-import');

      var opt = {
        cwd: join(base, 'css-import'),
        cwdbase: true
      };

      gulp.src('index.css', opt)
      .pipe(transport({pkg: pkg, rename: {suffix: '-debug'}}))
      .on('data', function(file) {
        util.winPath(file.originPath).should.include('css-import/index.css');
        util.winPath(file.path).should.include('css-import/index-debug.css');
        assert(file, 'transport-rename-css.css');
      })
      .on('end', done);
    });
  });

  xit('no handlebars deps', function(done) {
    var pkg = getPackage('no-handlebars');
    var opt = {
      cwd: join(base, 'no-handlebars'),
      cwdbase: true
    };

    gulp.src('index.js', opt)
    .pipe(transport({pkg: pkg, include: 'self'}))
    .once('error', function(e) {
      e.message.should.eql('handlebars-runtime not exist, but required .handlebars');

    })
    .on('end', done);
  });

  it('check path', function(done) {
    var pkg = getPackage('check-path');
    var opt = {
      cwd: join(base, 'check-path'),
      cwdbase: true
    };

    gulp.src('index.js', opt)
    .pipe(transport({pkg: pkg, include: 'self'}))
    .on('data', function(file) {
      assert(file, 'check-path.js');
    })
    .on('end', done);
  });

  it('require directory', function(done) {
    var pkg = getPackage('require-directory');
    var opt = {
      cwd: join(base, 'require-directory'),
      cwdbase: true
    };

    gulp.src('index.js', opt)
    .pipe(transport({pkg: pkg, include: 'self'}))
    .on('data', function(file) {
      assert(file, 'require-directory.js');
    })
    .on('end', done);
  });

  describe('exports', function() {
    var exports = require('..');

    it('transport', function() {
      exports.should.equal(transport);
    });

    it('plugin.js', function() {
      exports.plugin.js.should.equal(require('../lib/plugin/js'));
    });

    it('plugin.css', function() {
      exports.plugin.css.should.equal(require('../lib/plugin/css'));
    });

    it('plugin.css2js', function() {
      exports.plugin.css2js.should.equal(require('../lib/plugin/css2js'));
    });

    it('plugin.handlebars', function() {
      exports.plugin.handlebars.should.equal(require('../lib/plugin/handlebars'));
    });

    it('plugin.tpl', function() {
      exports.plugin.tpl.should.equal(require('../lib/plugin/tpl'));
    });

    it('plugin.json', function() {
      exports.plugin.json.should.equal(require('../lib/plugin/json'));
    });

    it('plugin.include', function() {
      exports.plugin.include.should.equal(require('../lib/plugin/include'));
    });

    it('plugin.concat', function() {
      exports.plugin.concat.should.equal(require('../lib/plugin/concat'));
    });

    it('common', function() {
      exports.common.should.equal(require('../lib/common'));
    });

    it('util', function() {
      exports.util.should.equal(require('../lib/util'));
    });
  });

});

function getPackage(name, options) {
  var dir = join(base, name);
  return new Package(dir, options);
}

function assert(file, expectedFile) {
  var code = file.contents.toString();
  var expected = readFile(__dirname + '/expected/' + expectedFile);
  code.should.eql(expected);
}

function readFile(path) {
  return fs.readFileSync(path).toString().replace(/\r/g, '');
}
