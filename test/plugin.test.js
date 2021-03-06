'use strict';

var should = require('should');
var fs = require('fs');
var join = require('path').join;
var File = require('vinyl');

var plugin = require('../lib/plugin');
var jsParser = plugin.js;
var css2jsParser = plugin.css2js;
var jsonParser = plugin.json;
var tplParser = plugin.tpl;
var htmlParser = plugin.html;
var handlebarsParser = plugin.handlebars;
var cssParser = plugin.css;
var include = plugin.include;
var concat = plugin.concat;
var dest = plugin.dest;
var file = plugin.file;
var createFile = require('./support/file');
var assert = require('./support/assertFile');
var getPackage = require('./support/getPackage');
var base = join(__dirname, 'fixtures');

describe('Plugin', function() {

  describe('js', function() {

    var pkg = getPackage('simple-transport', {entry: ['c.js']});

    it('transport js', function(done) {
      var fakeFile = createFile(pkg, 'c.js');

      var stream = jsParser({pkg: pkg, include: 'self'})
      .on('data', function(file) {
        assert(file, 'plugin-js.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport js ignore', function(done) {
      var pkg = getPackage('simple-transport', {
        entry: ['c.js'],
        ignore: ['b']
      });
      var fakeFile = createFile(pkg, 'c.js');

      var stream = jsParser({
        pkg: pkg,
        idleading: '{{name}}-{{version}}',
        include: 'self',
        global: {}
      })
      .on('data', function(file) {
        assert(file, 'plugin-js-ignore.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport js with type', function(done) {
      var pkg = getPackage('type-transport');
      var fakeFile = createFile(pkg, 'index.js');

      var stream = jsParser({pkg: pkg, include: 'self'})
      .on('data', function(file) {
        assert(file, 'plugin-js-type.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport js deep', function(done) {
      var fakeFile = createFile(pkg, 'sea-modules/b/1.1.0/src/b.js', pkg.getPackage('b@1.1.0').files['src/b.js']);

      var stream = jsParser({pkg: pkg, include: 'self'})
      .on('data', function(file) {
        assert(file, 'plugin-js-deep.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport js stylebox', function(done) {
      var pkg = getPackage('type-transport', {
        entry: ['stylebox.js']
      });
      var fakeFile = createFile(pkg, 'stylebox.js');

      var stream = jsParser({pkg: pkg, styleBox: true, include: 'self'})
      .on('data', function(file) {
        assert(file, 'plugin-js-stylebox.js');
      })
      .on('end', done);

      stream.write(fakeFile);
      stream.end();
    });
  });

  describe('css2js', function() {

    var pkg = getPackage('type-transport', {
      entry: ['stylebox.js']
    });

    it('transport css2js', function(done) {
      var fakeCss = createFile(pkg, 'a.css');

      var stream = css2jsParser({pkg: pkg})
      .on('data', function(file) {
        file.history[0].should.endWith('.css');
        file.path.should.endWith('.css.js');
        assert(file, 'plugin-css2js.js');
      })
      .on('end', done);
      stream.write(fakeCss);
      stream.end();
    });

    it('transport css2js with styleBox', function(done) {
      var fakeCss = createFile(pkg, 'stylebox.css');

      var stream = css2jsParser({pkg: pkg, styleBox: true})
      .on('data', function(file) {
        file.history[0].should.endWith('.css');
        file.path.should.endWith('.css.js');
        assert(file, 'plugin-css2js-stylebox.js');
      })
      .on('end', done);
      stream.write(fakeCss);
      stream.end();
    });
  });

  describe('json', function() {

    it('transport json', function(done) {
      var pkg = getPackage('type-transport');
      var fakeFile = createFile(pkg, 'a.json');

      var stream = jsonParser({pkg: pkg});
      stream
      .on('data', function(file) {
        file.history[0].should.endWith('.json');
        file.path.should.endWith('.json.js');
        assert(file, 'plugin-json.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });
  });

  describe('tpl', function() {

    it('transport tpl', function(done) {
      var pkg = getPackage('type-transport');
      var fakeFile = createFile(pkg, 'a.tpl');

      var stream = tplParser({pkg: pkg});
      stream
      .on('data', function(file) {
        file.history[0].should.endWith('.tpl');
        file.path.should.endWith('.tpl.js');
        assert(file, 'plugin-tpl.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport html', function(done) {
      var pkg = getPackage('type-transport');
      var fakeFile = createFile(pkg, 'a.html');

      var stream = htmlParser({pkg: pkg});
      stream
      .on('data', function(file) {
        file.history[0].should.endWith('.html');
        file.path.should.endWith('.html.js');
        assert(file, 'plugin-html.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });
  });

  describe('handlebars', function() {

    it('transport handlebars', function(done) {
      var pkg = getPackage('type-transport');
      var fakeFile = createFile(pkg, 'a.handlebars');

      var stream = handlebarsParser({pkg: pkg})
      .on('data', function(file) {
        file.history[0].should.endWith('.handlebars');
        file.path.should.endWith('.handlebars.js');
        assert(file, 'plugin-handlebars.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('transport handlebars not match', function(done) {
      var pkg = getPackage('handlebars-not-match');
      var fakeFile = createFile(pkg, 'a.handlebars');

      var stream = handlebarsParser({pkg: pkg})
      .on('error', function(e) {
        e.message.should.eql('the version of handlebars-runtime in package.json should be 1.3.0 but got 1.2.0');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('no handlebars deps', function(done) {
      var pkg = getPackage('no-handlebars');
      var fakeFile = createFile(pkg, 'a.handlebars');

      var stream = handlebarsParser({pkg: pkg})
      .on('data', function(file) {
        assert(file, 'plugin-handlebars.js');
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

  });

  describe('css', function() {

    var pkg = getPackage('css-import');

    it('transport css import', function(done) {
      var fakeFile = createFile(pkg, pkg.main);

      var stream = cssParser({pkg: pkg})
      .on('data', function(file) {
        file.path.should.endWith('.css');
        assert(file, 'plugin-css.css');
      })
      .on('end', done);

      stream.write(fakeFile);
      stream.end();
    });

    it('transport css import ignore', function(done) {
      var pkg = getPackage('css-import', {
        ignore: ['b']
      });
      var fakeFile = createFile(pkg, pkg.main);

      var stream = cssParser({pkg: pkg})
      .on('data', function(file) {
        assert(file, 'plugin-css-ignore.css');
      })
      .on('end', done);

      stream.write(fakeFile);
      stream.end();
    });

    xit('transport css import error', function(done) {
      var pkg = getPackage('css-import', {entry: ['a5.css']});
      var fakeFile = createFile(pkg, 'a5.css');

      var stream = cssParser({pkg: pkg})
      .on('error', function(e) {
        e.message.should.eql('package d not exists');
        e.plugin.should.eql('transport:css');
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });

    it('transport css conflict', function(done) {
      var pkg = getPackage('css-conflict');
      var fakeFile = createFile(pkg, pkg.main);

      var stream = cssParser({pkg: pkg})
      .on('error', function(e) {
        e.message.should.eql('c@1.0.0 conflict with c@1.0.1');
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });
  });

  describe('include', function() {

    it('all', function(done) {
      var pkg = getPackage('js-require-js');
      var fakeFile = createFile(pkg, pkg.main);

      var ret = [];
      var stream = include({pkg: pkg, include: 'all'})
      .on('data', function(file) {
        ret.push(file);
      })
      .on('end', function() {
        ret[0].relative.should.equal('src/index.js');
        should.not.exist(ret[0].dependentPath);
        ret[1].relative.should.equal('sea-modules/b/1.0.0/index.js');
        ret[1].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[2].relative.should.equal('sea-modules/camel-case/1.0.0/index.js');
        ret[2].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[3].relative.should.equal('sea-modules/camel-case/1.0.0/c.js');
        ret[3].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[4].relative.should.equal('sea-modules/camel-case/1.0.0/index.css');
        ret[4].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[5].relative.should.equal('sea-modules/b/1.0.0/b.js');
        ret[5].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[6].relative.should.equal('a.js');
        ret[6].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[7].relative.should.equal('sea-modules/b/1.0.0/c.js');
        ret[7].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[8].relative.should.equal('sea-modules/import-style/1.0.0/index.js');
        ret[8].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        ret[9].relative.should.equal('src/index.js');
        ret[9].dependentPath.should.equal(join(pkg.dest, 'src/index.js'));
        (ret[9].contents === null).should.be.true;
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('all with ignore', function(done) {
      var pkg = getPackage('ignore-package', {ignore: ['jquery']});
      var fakeFile = createFile(pkg, pkg.main);

      var ret = [];
      var stream = include({pkg: pkg, include: 'all', ignore: ['jquery']})
      .on('data', function(file) {
        ret.push(file);
      })
      .on('end', function() {
        ret[0].relative.should.equal('index.js');
        should.not.exist(ret[0].dependentPath);
        ret[1].relative.should.equal('index.js');
        ret[1].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        (ret[1].contents === null).should.be.true;
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('include other type', function(done) {
      var pkg = getPackage('type-transport', {});
      var fakeFile = createFile(pkg, pkg.main);

      var ret = [];
      var stream = include({pkg: pkg, include: 'all'})
      .on('data', function(file) {
        ret.push(file);
      })
      .on('end', function() {
        ret[0].relative.should.equal('index.js');
        should.not.exist(ret[0].dependentPath);
        ret[1].relative.should.equal('a.css');
        ret[1].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[2].relative.should.equal('a.json');
        ret[2].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[3].relative.should.equal('a.tpl');
        ret[3].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[4].relative.should.equal('a.html');
        ret[4].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[5].relative.should.equal('a.handlebars');
        ret[5].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[6].relative.should.equal('a.js');
        ret[6].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[7].relative.should.equal('react.js');
        ret[7].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[8].relative.should.equal('sea-modules/react/1.0.0/index.js');
        ret[8].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[9].relative.should.equal('sea-modules/handlebars-runtime/1.3.0/handlebars.js');
        ret[9].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[10].relative.should.equal('sea-modules/handlebars-runtime/1.3.0/handlebars-a.js');
        ret[10].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[11].relative.should.equal('sea-modules/import-style/1.0.0/index.js');
        ret[11].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        ret[12].relative.should.equal('index.js');
        ret[12].dependentPath.should.equal(join(pkg.dest, 'index.js'));
        (ret[12].contents === null).should.be.true;
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('skip when null', function(done) {
      var pkg = getPackage('type-transport', {});
      var filePath = join(base, 'simple-transport/index.js');
      var fakeFile = new File({
        path: filePath,
        contents: null
      });

      var ret = [];
      var stream = include({pkg: pkg, include: 'all'})
      .on('data', function(file) {
        ret.push(file);
      })
      .on('end', function() {
        ret.length.should.eql(1);
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });

    it('do not support stream', function() {
      var pkg = getPackage('type-transport', {});
      var stream = include({pkg: pkg, include: 'all'});
      var filePath = join(base, 'simple-transport/index.js');
      var fakeFile = new File({
        path: filePath,
        contents: fs.createReadStream(filePath)
      });

      (function() {
        stream.write(fakeFile);
        stream.end();
      }).should.throw('Streaming not supported.');
    });
  });

  describe('concat', function() {

    it('files', function(done) {
      var firstFile = new File({
        path: 'a.js',
        contents: new Buffer('a')
      });
      firstFile.customProperty = 'prop';
      var middleFile = new File({
        path: 'b.js',
        contents: new Buffer('b')
      });
      middleFile.dependentPath = 'a.js';
      var lastFile = new File({
        path: 'a.js',
        contents: new Buffer('a')
      });
      lastFile.dependentPath = 'a.js';

      var stream = concat()
      .on('data', function(file) {
        file.path.should.eql('a.js');
        file.customProperty.should.eql('prop');
        file.contents.toString().should.eql('ab');
      })
      .on('end', done);
      stream.write(firstFile);
      stream.write(middleFile);
      stream.write(lastFile);
      stream.end();
    });

    it('no end', function(done) {
      var firstFile = new File({
        path: 'a.js',
        contents: new Buffer('a')
      });
      firstFile.customProperty = 'prop';
      var middleFile = new File({
        path: 'b.js',
        contents: new Buffer('b')
      });
      middleFile.dependentPath = 'a.js';

      var isCalled = false;
      var stream = concat()
      .on('data', function() {
        isCalled = true;
      })
      .on('end', function() {
        isCalled.should.be.false;
        done();
      });
      stream.write(firstFile);
      stream.write(middleFile);
      stream.end();
    });
  });

  describe('dest', function() {

    var pkg = getPackage('simple-transport', {entry: ['c.js']});

    it('change file.path', function(done) {
      var fakeFile = createFile(pkg, 'c.js');

      var stream = dest({pkg: pkg, include: 'self'})
      .on('data', function(file) {
        file.path.should.equal(join(pkg.dest, 'simple-transport/1.0.0/c.js' ));
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });

    it('change file.path with function of idleading', function(done) {
      var fakeFile = createFile(pkg, 'c.js');

      var opt = {
        pkg: pkg,
        include: 'self',
        idleading: function() {
          return '';
        }
      };
      var stream = dest(opt)
      .on('data', function(file) {
        file.path.should.equal(join(pkg.dest, 'c.js' ));
      })
      .on('end', done);
      stream.write(fakeFile);
      stream.end();
    });
  });

  describe('file', function() {
    it('do not support stream', function() {
      var stream = file();
      var filePath = join(base, 'simple-transport/index.js');
      var fakeFile = new File({
        path: filePath,
        contents: fs.createReadStream(filePath)
      });

      (function() {
        stream.write(fakeFile);
        stream.end();
      }).should.throw('Streaming not supported.');
    });

    it('skip when is null', function(done) {
      var fakeFile = new File({
        path: 'a.js',
        contents: null
      });

      var stream = file();
      stream.on('data', function(file) {
        should.not.exists(file.file);
        done();
      });
      stream.write(fakeFile);
      stream.end();
    });
  });

});
