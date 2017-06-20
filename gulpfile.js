var gulp                = require('gulp'),
    autoprefixer        = require('gulp-autoprefixer'),
    concat              = require('gulp-concat'),
    cleancss            = require('gulp-clean-css'),
    htmlmin             = require('gulp-htmlmin'),
    fileinclude         = require('gulp-file-include'),
    imagemin            = require('gulp-imagemin'),
    imageminPngquant    = require('imagemin-pngquant'),
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
  prefix: '//node-module-assets.masterclass.com'
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
  gulp.watch('src/styles/**/*.scss', ['compileCSS']);
  gulp.watch('src/img/**/*.*', ['compileImages']);
});

// compile - compile markup, js, and styles
gulp.task('compile', ['compileCSS']);

// minify - Process everything, minify, move images, etc to /dist
gulp.task('minify', ['minifyCSS', 'minifyImages']);

// version - minify everything, upload images to s3, basically
// prepare for versioning
gulp.task('version', ['minify'], function(done){
  s3.sync(done);
});


// CSS Related
gulp.task('compileCSS', ['compileCore'], function() {
  return gulp.src([
      'src/styles/**/*.scss'
    ]);
});

// Compiles both the core scss file and any
// "in progress" components
gulp.task('compileCore', function() {
  return gulp.src([
      'src/styles/core.scss'
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
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    // .pipe(concat('core.css'))
    .pipe(gulp.dest('./dist/css'));
});


// Images
gulp.task('compileImages', function() {
  return gulp.src([
    'src/img/**/*'
  ])
  .pipe(gulp.dest('./dist/img'));
});


// ------------
// Shipping it
// ------------

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
