var isProd = false;
var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var gutil = require('gulp-util');
var babelify = require('babelify');
var del = require('del');
var license = require('gulp-license');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var zip = require('gulp-zip');
var bump = require('gulp-bump');

var scssSourcePath = './app/scss/**/*';
var jsSourcePath = './app/javascript/**/*';
var contentScriptEntryPath = './app/javascript/contentScript.js';

gulp.task('jshint', function() {
  return gulp.src(jsSourcePath)
    .pipe(jshint({
      laxbreak: true,
      laxcomma: true,
      esnext: true, //JSHint Harmony/ES6
      eqnull: true,
      browser: true
    }))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('clean', function(done) {
  return del(['./target'], done);
});

gulp.task('styles', function() {
  return gulp.src(scssSourcePath)
    .pipe(sass({
      outputStyle: isProd ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(license('MIT', {
      tiny: true
    }))
    .pipe(gulp.dest('./target/styles'));
});

gulp.task('scripts', function() {
  var bundler = browserify(contentScriptEntryPath, {
    debug: !isProd
  }).transform(babelify, {
    presets: ["es2015"]
  });

  var b = bundler.bundle()
    .on('log', gutil.log.bind(gutil, 'Browserify Log'))
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('cs.js'))
    .pipe(buffer());

  if (isProd) {
    b = b.pipe(uglify().on('error', gutil.log));
  } else {
    b = b.pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(sourcemaps.write('./'))
  }

  return b.pipe(license('MIT', {
    tiny: true
  })).pipe(gulp.dest('./target/scripts'));
});

gulp.task('copy-manifest', function() {
  return gulp.src('./app/manifest.json')
    .pipe(gulp.dest('./target'));
});

gulp.task('build', ['styles', 'scripts', 'copy-manifest'], function() {
  gulp.src('./target/**')
    .pipe(zip('target.zip'))
    .pipe(gulp.dest('./target'));
});

gulp.task('bump', function() {
  gulp.src('./package.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./'));

  return gulp.src('./app/manifest.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./app'));
});

gulp.task('watch', function() {
  gulp.watch(scssSourcePath, ['styles']);

  // TODO benoit
  // watchBundles();
});

gulp.task('default', function() {
  return runSequence('clean', ['styles', 'scripts'], 'copy-manifest', 'watch');
});

gulp.task('prod', function() {
  isProd = true;
  return runSequence('clean', ['styles', 'scripts'], 'bump', 'copy-manifest', 'build');
});
