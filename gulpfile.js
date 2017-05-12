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
  gulp.watch('src/scss/**/*.scss', ['compileCSS']);
  gulp.watch('src/js/**/*.js', ['compileJS']);
  gulp.watch('src/img/**/*.*', ['compileImages']);
});

// compile - compile markup, js, and styles
gulp.task('compile', ['compileMarkup', 'compileCSS', 'compileJS', 'compileImages']);

// ship - Process everything, minify, move images, etc to /dist
gulp.task('ship', ['minifyMarkup', 'minifyCSS', 'compileJS', 'minifyImages']);

// -------
// Markup
// -------
gulp.task('compileMarkup', function() {
  return gulp.src([
    'src/html/*.html',
    'src/html/pages/*.html'
    ])
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
gulp.task('compileCSS', ['compileCore', 'compileCoreComponents', 'compileStylePages'], function() {
  return gulp.src([
      'src/scss/core.scss',
      'src/pages/*.scss'
    ])
    .pipe(livereload());
});

gulp.task('compileCore', function() {
  return gulp.src([
      'src/scss/core.scss'
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
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('compileCoreComponents', function() {
  return gulp.src([
      'src/scss/components/*.scss'
    ])
    .pipe(gulp.dest('./dist/css/components'));
});

gulp.task('compileStylePages', function() {
  return gulp.src([
      'src/scss/pages/*.scss'
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
    .pipe(gulp.dest('./dist/css/pages'));
});


// Images
gulp.task('compileImages', function() {
  return gulp.src([
    'src/img/**/*'
  ])
  .pipe(gulp.dest('./dist/img'))
  .pipe(livereload());
});


// ------------
// Shipping it
// ------------

// Markup
gulp.task('minifyMarkup', ['compileMarkup'], function() {
  return gulp.src(['./dist/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/'))
    .pipe(livereload());
});

// CSS
gulp.task('minifyCSS', ['compileCSS'], function() {
  return gulp.src(['./dist/css/core.css'])
    .pipe(cleancss())
    .pipe(gulp.dest('./dist/css'));
});

// Images
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