var gulp = require('gulp'),
    sass = require('gulp-sass'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    runSequence = require('run-sequence'),
    handlebars = require('gulp-ember-handlebars');


gulp.task('clean', function() {
  return gulp.src(['./build'], {base: '.', read: false})
    .pipe(clean());
});

gulp.task('sass', function () {
  return gulp.src('./app/scss/*.scss')
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./build/app/css/'));
});

gulp.task('scripts', function() {
  return gulp.src('./app/js/**/*.js')
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/app/js/'))
});

gulp.task('templates', function(){
  return gulp.src(['./app/hbs/**/*.hbs'])
    .pipe(handlebars({
      outputType: 'browser'
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('./build/app/js/'));
});

gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/ember/ember.min.js',
    'bower_components/handlebars/handlebars.js',
    'bower_components/normalize.css/normalize.css',
    'bower_components/pure/pure-min.css'
  ]).pipe(gulp.dest('./build/vendor/'));
});

gulp.task('build', function() {
  return runSequence('clean', ['sass', 'templates', 'scripts', 'vendor'], function() {
    return gulp.src([
      './app/img/**/*',
      './app/fonts/**/*',
      './app/index.html',
      './ext/**/*',
      './manifest.json',
      './icons/*'
    ], {base: '.'}).pipe(gulp.dest('./build'));
  });
});

gulp.task('watch', function() {
  gulp.watch([
    './app/scss/**/*',
    './app/img/**/*',
    './app/js/**/*',
    './app/hbs/**/*',
    './app/fonts/**/*',
    './app/index.html',
    './ext/**/*',
    './manifest.json',
    './icons/*'
  ], ['build']);
});