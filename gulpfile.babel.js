var isProd = false;
var gulp = require('gulp'),
  babelify = require('babelify'),
  browserify = require('browserify'),
  buffer = require('vinyl-buffer'),
  bump = require('gulp-bump'),
  del = require('del'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  license = require('gulp-license'),
  runSequence = require('run-sequence'),
  sass = require('gulp-sass'),
  source = require('vinyl-source-stream'),
  sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  zip = require('gulp-zip');

var scssSourcePath = './src/scss/**/*';
var jsSourcePath = './src/javascript/**/*';
var contentScriptEntryPath = './src/javascript/contentScript.js';

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
  })
  .transform(babelify);

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
  return gulp.src('./src/manifest.json')
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

  return gulp.src('./src/manifest.json')
    .pipe(bump({
      type: 'patch'
    }))
    .pipe(gulp.dest('./src'));
});

gulp.task('watch', function() {
  gulp.watch(scssSourcePath, ['styles']);

  // TODO benoit
  // watchBundles();
});

gulp.task('default', function() {
  return runSequence('clean', ['styles', 'scripts', 'copy-manifest']);
});

gulp.task('prod', function() {
  isProd = true;
  return runSequence('clean', 'bump', 'build');
});
