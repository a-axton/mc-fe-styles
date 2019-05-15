var gulp                = require('gulp'),
    autoprefixer        = require('gulp-autoprefixer'),
    cleancss            = require('gulp-clean-css'),
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
  prefix: 'https://node-module-assets.masterclass.com'
});

var assetUrl = {
  'asset-url($path)': function(path) {
    return nodeSass.types.String(`url('${s3.getUrl(path.getValue())}')`);
  }
};

// ----------
// Root tasks
// ----------

// CSS
gulp.task('compileCSS', function() {
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
      browsers: ['last 99 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Images
gulp.task('compileImages', function() {
  return gulp.src([
    'src/img/**/*'
  ])
  .pipe(gulp.dest('./dist/img'));
});

// Helper to list out S3 images
gulp.task('s3:list', function(done) {
  s3.list(function(err, data) {
    console.log(data)
    done();
  });
});


// ----------
// Versioning
// ----------

// CSS
gulp.task('minifyCSS', function() {
  return gulp.src(['./dist/css/core.css'])
    .pipe(cleancss({
      level: 2
    }))
    .pipe(gulp.dest('./dist/css'));
});

// Images
gulp.task('minifyImages', function() {
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

// S3 Image Syncing
gulp.task(
  's3Sync', function(done) {
    s3.sync(done);
  }
);


// --------------
// Wrapping tasks
// --------------

// Compile - compile styles and images
gulp.task(
  'compile',
  gulp.parallel('compileCSS', 'compileImages')
);

// Minify - Compile CSS, minify images
// move everything to /dist
gulp.task(
  'minify',
  gulp.parallel('minifyCSS', 'minifyImages')
);

// Version - take minified images and upload
// to s3. This task is called by
// npm version patch!
gulp.task(
  'version',
  gulp.series('compile', 'minify', 's3Sync')
);

// Watchers
gulp.task(
  'watchCSS', function() {
    gulp.watch('src/styles/**/*.scss', gulp.series('compileCSS', 'minifyCSS'));
  }
);

gulp.task(
  'watchImages', function() {
    gulp.watch('src/img/**/*.*', gulp.series('compileImages'));
  }
);

// Watcher
gulp.task('watch', gulp.parallel('watchCSS', 'watchImages'));

// gulp - Default is just to watch for changes
gulp.task('default', gulp.series('compile', 'watch'));
