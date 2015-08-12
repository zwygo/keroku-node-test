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

// set the environment
var env = process.env.NODE_ENV || 'development';

// remove the public folder
gulp.task('clean', function() {
  del('public/**');
});

// js linter
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

// put all js files into one app.js and put into public folder
gulp.task('scripts', function() {
  return gulp.src('./app/scripts/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(livereload());
});

// compile all scss files into one and put into public folder
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

// third pary js files
gulp.task('vendor', function() {
  return gulp.src(mainBowerFiles())
    .pipe(filter('**/*.js'))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js'));
});

// create an express app
var app = express();
// look for static files in the public directory
app.use(express.static('./public'));
// set the view engine to be ejs, look for views in '/'
app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
// route all requests to index.ejs, where angular takes over
app.all('/*', function(req, res) {
  res.locals.env = env;
  res.render('index');
});
// start the express server
gulp.task('express', function() {
  app.listen(process.env.PORT || 4000);
  livereload.listen();
  console.log("Listening on port 4000");
});

// when scss, js, or html files change, run the appropriate task to rebuild and
// restart the app
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

// watch and auto reload for updated files
gulp.task('default',
  ['scripts', 'views', 'styles', 'vendor', 'lint', 'watch', 'express'],
  function() {}
);
