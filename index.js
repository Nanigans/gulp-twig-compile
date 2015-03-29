var through = require('through2');
var twigModule = require('twig');
var twig = twigModule.twig;
var gutil = require('gulp-util');
var merge = require('merge');

var deleteTemplateById = function(id) {
  twigModule.extend(function(Twig) {
    delete Twig.Templates.registry[id];
  });
};

var PluginError = gutil.PluginError;

module.exports = function (opt) {
  function transform(file, enc, cb) {
    if (file.isNull()) return cb(null, file);
    if (file.isStream()) return cb(new PluginError('gulp-twig-compile', 'Streaming not supported'));

    var options = merge({
      twig: 'twig'
    }, opt);
    var data;
    try {
      // remove the template from registry if exists, to allow watch and rewrite with the same id
      deleteTemplateById(file.relative);
      var template = twig({id: file.relative, data: file.contents.toString('utf8')});
      data = template.compile(options);
    } catch (err) {
      return cb(new PluginError('gulp-twig-compile', err));
    }

    file.contents = new Buffer(data);
    file.path = file.path + '.js';

    cb(null, file);
  }

  return through.obj(transform);
};