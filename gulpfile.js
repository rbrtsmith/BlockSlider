var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    esLint = require('gulp-eslint'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel');


gulp.task('JS', function() {
	return gulp
		.src('src/block-slider.js')
		.pipe(plumber())
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'))
});

gulp.task('default', ['JS']);