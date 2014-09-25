'use strict';
var should = require('should');
var path = require('path');
var gutil = require('gulp-util');
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var Twig = require('twig');
var twig_compile = require('./');

require('mocha');



describe('gulp-twig-compile', function() {
  it('should append js to file names', function (done) {
    var compile = twig_compile({module:'amd'});

    compile.on('data', function (file) {
      file.path.should.equal('template.twig.js');
      done();
    });

    compile.write(new gutil.File({
      path: 'template.twig',
      contents: new Buffer('')
    }));
  });

  it('should compile template with default options', function (done) {
    var template_stub = {};
    template_stub.compile = function(opt) { return JSON.stringify(opt)};

    var twig_stub = sinon.stub(Twig, 'twig').returns(template_stub);

    var proxy_compiler = proxyquire('./index', {'twig': twig_stub});

    var compile = proxy_compiler();

    compile.on('data', function (file) {
      file.contents.toString('utf8').should.equal('{"twig":"twig"}');
      done();
    });

    compile.write(new gutil.File({
      path: 'template.twig',
      contents: new Buffer('')
    }));

    Twig.twig.restore();
  });

  it('should compile template with options and custom twig', function (done) {
    var template_stub = {};
    template_stub.compile = function(opt) { return JSON.stringify(opt)};

    var twig_stub = sinon.stub(Twig, 'twig').returns(template_stub);

    var proxy_compiler = proxyquire('./index', {'twig': twig_stub});

    var compile = proxy_compiler({module:'module', junk:'trash', twig: 'customTwig'});

    compile.on('data', function (file) {
      file.contents.toString('utf8').should.equal('{"twig":"customTwig","module":"module","junk":"trash"}');
      done();
    });

    compile.write(new gutil.File({
      path: 'template.twig',
      contents: new Buffer('')
    }));

    Twig.twig.restore();
  });

  it('should create a twig template with relative path as the template id', function (done) {
    var template_stub = {};
    template_stub.compile = function(opt) { return JSON.stringify(opt)};

    var twig_stub = sinon.stub(Twig, 'twig')
      .withArgs({id: 'views/template.twig', data: 'some twig template'})
      .returns(template_stub);

    var proxy_compiler = proxyquire('./index', {'twig': twig_stub});

    var compile = proxy_compiler();
    compile.on('data', function (file) {
      done();
    });

    compile.write(new gutil.File({
      cwd: __dirname,
      base: __dirname,
      path: path.join(__dirname, 'views', 'template.twig'),
      contents: new Buffer('some twig template')
    }));

    Twig.twig.restore();
  });

  it('should emit errors correctly', function(done) {
    var template_stub = {};
    template_stub.compile = function(opt) { throw "FAIL!"};

    var twig_stub = sinon.stub(Twig, 'twig')
      .withArgs({id: 'template.twig', data: 'some twig template'})
      .returns(template_stub);

    var proxy_compiler = proxyquire('./index', {'twig': twig_stub});

    var compile = proxy_compiler();
    compile.on('error', function(err) {
        err.message.should.equal('FAIL!');
        done();
      })
      .on('data', function(newFile) {
        throw new Error('no file should have been emitted!');
      })
      .write(new gutil.File({
        path: 'template.twig',
        contents: new Buffer('some twig template')
      }));
  });

  it('should let null files pass through', function (done) {
    var compile = twig_compile({});

    compile.on('data', function (file) {
      file.path.should.equal('null.twig');
      done();
    });

    compile.write(new gutil.File({
      path: 'null.twig',
      contents: null
    }));
  });

});
