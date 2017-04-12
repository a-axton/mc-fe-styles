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
  gulp.watch('src/html/*.html', ['compileMarkup']);
  gulp.watch('src/js/**/*.js', ['compileJS']);
  gulp.watch('src/scss/**/*.scss', ['compileStyles']);
  gulp.watch('src/img/**/*.*', ['compileImages']);
});

// compile - compile markup, js, and styles
gulp.task('compile', ['compileMarkup', 'compileJS', 'compileStyles', 'compileImages']);

// ship - Process everything, minify, move images, etc to /public
gulp.task('ship', ['minifyMarkup', 'minifyStyles', 'minifyImages']);


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
    .pipe(gulp.dest('./public'))
    .pipe(livereload());
});

gulp.task('minifyMarkup', ['compileMarkup'], function() {
  return gulp.src(['src/html/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      minifyJS: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./public/'));
});


// JS related
gulp.task('compileJS', function() {
  return gulp.src([
    'src/js/**/*.js'
  ])
  .pipe(concat('site.js'))
  .pipe(gulp.dest('./public/js'))
  .pipe(livereload());
});


// CSS Related
gulp.task('compileStyles', function() {
  return gulp.src([
      'src/scss/site.scss'
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
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('minifyStyles', ['compileStyles'], function() {
  return gulp.src('./public/css/site.css')
    .pipe(cleancss())
    .pipe(gulp.dest('./public/css'));
});


// Image related
gulp.task('compileImages', function() {
  return gulp.src([
    'src/img/**/*'
  ])
  .pipe(gulp.dest('./public/img'))
  .pipe(livereload());
});

gulp.task('minifyImages', ['compileImages'], function() {
  return gulp.src([
    'public/img/**/*'
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
  .pipe(gulp.dest('./public/img'));
});