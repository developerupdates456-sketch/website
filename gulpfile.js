const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const livereload = require('gulp-livereload');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const cssnext = require('postcss-cssnext');
const pxtorem = require('postcss-pxtorem');
const reporter = require('postcss-reporter');
const header = require('gulp-header');

const banner = [
  '/**',
  ' * Timeline - a horizontal / vertical timeline component',
  ' * v1.1.5',
  ' * Copyright Mike Collins',
  ' * MIT License',
  ' */',
  '',
].join('\n');

gulp.task('build-js', function () {
  return gulp
    .src('public_html/src/js/timeline.js')
    .pipe(plumber())
    .pipe(
      babel({
        presets: ['@babel/preset-env'],
      })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(header(banner))
    .pipe(gulp.dest('public_html/dist/js'));
});

gulp.task('build-css', function () {
  const processors = [
    cssnext({
      browsers: ['last 5 versions'],
    }),
    pxtorem({
      propWhiteList: [
        'font-size',
        'padding',
        'line-height',
        'letter-spacing',
        'margin',
      ],
      mediaQuery: true,
      replace: true,
    }),
    reporter({
      clearMessages: true,
    }),
  ];

  return gulp
    .src('public_html/src/scss/timeline.scss')
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public_html/dist/css'));
});

gulp.task('images', function () {
  return gulp
    .src('public_html/src/images/**')
    .pipe(imagemin())
    .pipe(gulp.dest('public_html/dist/images'));
});

gulp.task('watch', function () {
  livereload.listen();

  gulp.watch(
    'public_html/src/scss/**/*.scss',
    gulp.series('build-css')
  );

  gulp.watch(
    'public_html/src/js/**/*.js',
    gulp.series('build-js')
  );

  gulp.watch(
    'public_html/src/images/**',
    gulp.series('images')
  );
});

gulp.task(
  'build',
  gulp.parallel('build-js', 'build-css', 'images')
);

gulp.task('default', gulp.series('build'));