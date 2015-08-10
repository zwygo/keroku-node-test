var gulp = require('gulp'),
  express = require('express'),
  jshint = require('gulp-jshint'),
  concat = require('gulp-concat'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require('gulp-rename'),
  livereload = require('gulp-livereload'),
  del = require('del'),
  filter = require('gulp-filter'),
  mainBowerFiles = require('main-bower-files');

var src = {
  styles: './app/styles/**/*.scss'
};

var dest = {
  styles: './public/styles/'
};

gulp.task('clean', function() {
  del('public/**');
});

gulp.task('lint', function() {
  return gulp.src('./app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('./app/index.html')
  // And put it in the dist folder
  .pipe(gulp.dest('public/'))
  .pipe(livereload());

  // Any other view files from app/views
  gulp.src('./app/views/**/*')
  // Will be put in the public/views folder
  .pipe(gulp.dest('public/views/'))
  .pipe(livereload());
});

gulp.task('scripts', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

gulp.task('styles', function() {
  return gulp.src('./app/styles/**/*.scss')
    .pipe(sass({
      style: 'expanded',
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('vendor', function() {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.js'))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));
});

var app = express();
app.use(express.static('./public'));
app.all('/*', function(req, res) {
  res.sendFile('index.html', { root: 'public' });
});
gulp.task('express', function() {
  app.listen(4000);
  livereload.listen();
  console.log("Listening on port 4000");
});

gulp.task('watch', function() {
  gulp.watch(
    ['./app/styles/*.scss', './app/styles/**/*.scss'],
    ['styles']
  );
  gulp.watch(
    ['./app/scripts/*.js', './app/scripts/**/*.js'],
    ['scripts', 'lint']
  );
  gulp.watch(
    ['./app/index.html', './app/views/**/*.html'],
    ['views']
  );
});

gulp.task('default',
  ['scripts', 'views', 'styles', 'vendor', 'lint', 'watch', 'express'],
  function() {}
);