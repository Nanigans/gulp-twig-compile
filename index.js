var through = require('through2');
var twig = require('twig').twig;
var gutil = require('gulp-util');
var merge = require('merge');

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
      var template = twig({id: file.relative.replace(/\\/g, '/'), data: file.contents.toString('utf8')});
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
