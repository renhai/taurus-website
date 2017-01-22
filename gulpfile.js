var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var minify = require('gulp-minify-css');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var path = require('path');
var uglify = require('gulp-uglify');
var pump = require('pump');


var bases = {
 app: 'app/',
 dist: 'dist/',
 bowerDir: 'bower_components/' 
};
var paths = {
  html: ['./**/*.html'],
  favicon: ['favicon.ico'],
  scripts: ['scripts/**/*.js'],
  styles: ['css/**/*.css']
};

gulp.task('clean', function () {
    return gulp.src('./dist', {read: false})
        .pipe(clean());
});

gulp.task('styles', ['clean'], function() {

  return gulp.src(paths.styles, {cwd: bases.app})
  // .pipe(less())
  .pipe(minify())
  .pipe(gulp.dest(bases.dist + 'css'));
});

gulp.task('scripts', ['clean'], function() {
    return gulp.src(
      paths.scripts, {cwd: bases.app}
    )
    // .pipe(uglify())
    .pipe(gulp.dest(bases.dist + 'scripts/'));
});


gulp.task('copy', ['clean'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 gulp.src(paths.favicon, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));

 return gulp.src(bases.bowerDir + '/**')
 .pipe(gulp.dest(bases.dist + 'bower_components'));

});

gulp.task('default', ['clean', 'styles', 'scripts', 'copy']);
