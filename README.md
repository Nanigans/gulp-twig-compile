gulp-twig-compile
=================

[![Build Status](https://travis-ci.org/Nanigans/gulp-twig-compile.png?branch=master)](https://travis-ci.org/Nanigans/gulp-twig-compile)
[![dependencies](https://david-dm.org/Nanigans/gulp-twig-compile.png)](https://david-dm.org/Nanigans/gulp-twig-compile)


[![NPM info](https://nodei.co/npm/gulp-twig-compile.png?downloads=true)](https://nodei.co/npm/gulp-twig-compile.png?downloads=true)

## Information

<table>
<tr> 
<td>Package</td><td>gulp-twig-compile</td>
</tr>
<tr>
<td>Description</td>
<td>Compiles Twig Templates to Javascript using [Twig.js](https://github.com/justjohn/twig.js)</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.9</td>
</tr>
</table>

## Installation

```sh
npm install --save gulp-twig-compile
```

## Usage

```javascript
var twig_compile = require('gulp-twig-compile');

gulp.task('twig', function() {
  gulp.src('./src/**/*.twig')
    .pipe(twig_compile())
    .pipe(gulp.dest('./dest/'))
});
```


## Options

The options object supports the `module` and `twig` options for the [Twig compiler](https://github.com/justjohn/twig.js/wiki/Compiling-Templates).

 * `module`  
   Should the output be written in module format. Supported formats:
     * node:  Node.js / CommonJS 1.1 modules
     * amd:   RequireJS / Asynchronous modules (requires `twig`)
     * cjs2:  CommonJS 2.0 draft8 modules (requires `twig`)
 * `twig`  
   Used with module. The location relative to the output directory of twig.js. (used for module dependency resolution).

```javascript
var twig_compile = require('gulp-twig-compile');

gulp.task('twig', function() {
  gulp.src('./src/**/*.twig')
    .pipe(twig_compile({module: 'amd', twig: 'lib/twig'}))
    .pipe(gulp.dest('./dest/'))
});
```
