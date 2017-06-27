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
    nodeSass            = require('node-sass'),
    util                = require('gulp-util'),
    S3ModuleSync        = require('@masterclass/mc-s3-module-sync');

// Define variables for S3 sync tasks
var s3 = new S3ModuleSync({
  // Sync this path to s3
  s3Dir: './dist/img',
  // When locally running, use this path
  localPath: 'http://localhost:3001/img',
  // which NODE_ENV var should produce s3 urls instead of local
  env: 'production',
  // Prefix url with...
  prefix: 'https://d2y1uetpctfe4a.cloudfront.net'
});

var assetUrl = {
  'asset-url($path)': function(path) {
    return nodeSass.types.String(`url('${s3.getUrl(path.getValue())}')`);
  }
};

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

// minify - Process everything, minify, move images, etc to /dist
gulp.task('minify', ['minifyMarkup', 'minifyCSS', 'compileJS', 'minifyImages']);

// version - minify everything, upload images to s3, basically
// prepare for versioning
gulp.task('version', ['minify'], function(done){
  s3.sync(done);
});

// -------
// Markup
// -------
gulp.task('compileMarkup', function() {
  return gulp.src([
    'src/html/*.html',
    'src/html/pages/**/*.html'
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
      basepath: 'src/html'
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(livereload());
});


// JS related
gulp.task('compileJS', function() {
  return gulp.src([
    'src/js/**/*.js'
  ])
  .pipe(gulp.dest('./dist/js'))
  .pipe(livereload());
});


// CSS Related
gulp.task('compileCSS', ['compileCore', 'compileStaticComponents', 'compileStyleGuide'], function() {
  return gulp.src([
      'src/scss/**/*.scss'
    ])
    .pipe(livereload());
});

// Compiles both the core scss file and any
// "in progress" components
gulp.task('compileCore', function() {
  return gulp.src([
      'src/scss/core.scss',
      'src/scss/components/dynamic/**/*.scss'
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
    .pipe(sass({
      style: 'compressed',
      functions: assetUrl
    }))
    .pipe(autoprefixer('last 99 versions'))
    .pipe(concat('core.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('compileStaticComponents', function() {
  return gulp.src([
      'src/scss/components/static/**/*'
    ])
    .pipe(gulp.dest('./dist/css/components'));
});

gulp.task('compileStyleGuide', function() {
  return gulp.src([
      'src/scss/pages/mc-style-guide.scss'
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
    .pipe(sass({
      style: 'compressed',
      functions: assetUrl
    }))
    .pipe(autoprefixer('last 99 versions'))
    .pipe(gulp.dest('./dist/css/style-guide'));
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
    .pipe(cleancss({
      level: 2
    }))
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

// S3 image sync
gulp.task('s3:list', function(done) {
  s3.list(function(err, data) {
    console.log(data)
    done();
  });
});