var gulp                = require('gulp'),
    autoprefixer        = require('gulp-autoprefixer'),
    concat              = require('gulp-concat'),
    cleancss            = require('gulp-clean-css'),
    htmlmin             = require('gulp-htmlmin'),
    fileinclude         = require('gulp-file-include'),
    imagemin            = require('gulp-imagemin'),
    imageminPngquant    = require('imagemin-pngquant'),
    livereload          = require('gulp-livereload'),
    notifier            = require('node-notifier'),
    plumber             = require('gulp-plumber'),
    sass                = require('gulp-sass'),
    util                = require('gulp-util');

// gulp - Default is just to watch for changes
gulp.task('default', ['watch']);

// Which is this
gulp.task('watch', ['compile'], function() {
  livereload.listen();
  gulp.watch('src/html/**/*.html', ['compileMarkup']);
  gulp.watch('src/js/**/*.js', ['compileJS']);
  gulp.watch('src/scss/**/*.scss', ['compileStyles']);
  gulp.watch('src/img/**/*.*', ['compileImages']);
});

// compile - compile markup, js, and styles
gulp.task('compile', ['compileJS', 'compileStyles', 'compileImages', 'compileMarkup']);

// ship - Process everything, minify, move images, etc to /dist
gulp.task('ship', ['minifyMarkup', 'minifyStyles', 'minifyImages', 'compileJS']);


// Markup related
gulp.task('compileMarkup', function() {
  return gulp.src(['src/html/*.html'])
    .pipe(plumber({
      errorHandler: function(err) {
        util.log(
          util.colors.red(err)
        );

        notifier.notify({
          title: 'Build Error',
          message: err.message
        });

        this.emit('end');
      }
    }))
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});

gulp.task('minifyMarkup', ['compileMarkup'], function() {
  return gulp.src(['./dist/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/'));
});


// JS related
gulp.task('compileJS', function() {
  return gulp.src([
    'src/js/**/*.js'
  ])
  .pipe(concat('site.js'))
  .pipe(gulp.dest('./dist/js'))
  .pipe(livereload());
});


// CSS Related
gulp.task('compileStyles', function() {
  return gulp.src([
      'src/scss/*.scss'
    ])
    .pipe(plumber({
      errorHandler: function(err) {
        util.log(
          'Error ' +
          util.colors.bold.bgRed(err)
        );

        notifier.notify({
          title: 'Build Error',
          message: err.message
        });

        this.emit('end');
      }
    }))
    .pipe(sass({style: 'compressed'}))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 9'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(livereload());
});

gulp.task('minifyStyles', ['compileStyles'], function() {
  return gulp.src('./dist/css/core.css')
    .pipe(cleancss())
    .pipe(gulp.dest('./dist/css'));
});


// Image related
gulp.task('compileImages', function() {
  return gulp.src([
    'src/img/**/*'
  ])
  .pipe(gulp.dest('./dist/img'))
  .pipe(livereload());
});

gulp.task('minifyImages', ['compileImages'], function() {
  return gulp.src([
    'dist/img/**/*'
  ])
  .pipe(imagemin([
    imageminPngquant({
      // https://www.npmjs.com/package/imagemin-pngquant#speed
      quality: "0-99",
      speed: 1
    }),
    imagemin.jpegtran({
      progressive: true
    })
  ]))
  .pipe(gulp.dest('./dist/img'));
});