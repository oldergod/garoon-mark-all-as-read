'use strict';

let isProd = false;
import gulp from 'gulp';
import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import bump from 'gulp-bump';
import del from 'del';
import gutil from 'gulp-util';
import license from 'gulp-license';
import livereload from 'gulp-livereload';
import replace from 'gulp-replace';
import rename from 'gulp-rename';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import watchify from 'watchify';
import zip from 'gulp-zip';

const stylesSourcePath = './src/styles/**/*.scss';
const scriptsSourcePath = './src/scripts/**/*.js';
const manifestPath = './src/manifest.json';
const manifestDebugPath = './src/manifest_debug.json';
const assetsPath = './src/assets/**/*';

const bundles = {
  'chromereload': {
    url: './src/scripts/chromereload.js',
    name: 'chromereload.js',
    bundle: null
  },
  'contentScript': {
    url: './src/scripts/contentScript.js',
    name: 'contentScript.js',
    bundle: null
  }
};

function createBundle(url) {
  return browserify(url, {
    debug: !isProd
  }).transform(babelify, {
    presets: ["es2015"]
  });
}

function watchBundles() {
  let watch = null;
  for (let bundleName in bundles) {
    watch = watchify(bundles[bundleName].bundle);
    watch.on('update', buildBundle.bind(this, bundleName));
  }
}

function buildBundle(bundleName) {
  const job = bundles[bundleName];
  const bundle = job.bundle;
  const name = job.name;

  let b = bundle.bundle()
    .on('log', gutil.log.bind(gutil, 'Browserify Log'))
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source(name))
    .pipe(buffer());

  if (isProd) {
    b = b.pipe(replace(/@DEBUG-ON@/g, '@DEBUG-OFF@'))
        .pipe(uglify().on('error', gutil.log.bind(gutil, 'Uglify Error')));
  }

  return b.pipe(license('MIT', {
    organization: 'Benoit Quenaudon',
    tiny: true
  })).pipe(gulp.dest('./target/scripts'));
}

gulp.task('clean', (done) => {
  if (isProd) {
    delete bundles.chromereload;
  }
  return del(['./target'], done);
});

gulp.task('styles', () => {
  return gulp.src(stylesSourcePath)
    .pipe(sass({
      outputStyle: isProd ? 'compressed' : 'expanded'
    }).on('error', sass.logError))
    .pipe(license('MIT', {
      organization: 'Benoit Quenaudon',
      tiny: true
    }))
    .pipe(gulp.dest('./target/styles'));
});

gulp.task('scripts', function(done) {
  const bundlePromises = [];
  for (let bundleName in bundles) {
    bundlePromises.push(
      new Promise((resolve, reject) => {
        let readable = buildBundle(bundleName);
        readable.on('end', () => {
          resolve();
        });
      })
    );
  }
  Promise.all(bundlePromises).then(() => done());
});

gulp.task('watch', function() {
  livereload.listen();

  gulp.watch(stylesSourcePath, function() {
    return runSequence('styles', 'livereloadReload');
  });
  gulp.watch(manifestPath_(), function() {
    return runSequence('manifest', 'livereloadReload');
  });
  gulp.watch(assetsPath, function() {
    return runSequence('assets', 'livereloadReload');
  });

  gulp.watch(scriptsSourcePath, function() {
    return runSequence('scripts', 'livereloadReload');
  });

  // cannot get it working...
  // watchBundles();
});

gulp.task('livereloadReload', function() {
  livereload.reload();
});

function manifestPath_() {
  if (isProd) {
    return manifestPath;
  }
  return manifestDebugPath;
}

gulp.task('manifest', () => {
  let p = gulp.src(manifestPath_());
  if (!isProd) {
    p = p.pipe(rename('manifest.json'));
  }
  return p.pipe(gulp.dest('./target'));
});

gulp.task('assets', () => {
  gulp.src(assetsPath)
    .pipe(gulp.dest('./target/assets'));
});

(function() {
  for (let bundleName in bundles) {
    bundles[bundleName].bundle = createBundle(bundles[bundleName].url);
  }
})();

var allTasks = ['styles', 'scripts', 'manifest', 'assets'];

gulp.task('build', allTasks, () => {
  gulp.src('./target/**')
    .pipe(zip('target.zip'))
    .pipe(gulp.dest('./target'));
});

gulp.task('bump', () => {
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

gulp.task('default', cb => {
  return runSequence('clean', allTasks, 'watch', cb);
});

gulp.task('prod', cb => {
  isProd = true;
  return runSequence('clean', 'bump', 'build', cb);
});
