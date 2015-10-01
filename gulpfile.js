var gulp = require('gulp'),
    pkg = require('./package.json'),
    uglify = require('gulp-uglify'),
    esLint = require('gulp-eslint'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    header = require('gulp-header'),
    banner = ['/**',
		' * Block Slider a responsive autoslide component.',
		' * v. 0.1.0',
		' * Copyright Robert Smith http://rbrtsmith.com',
		' * MIT License',
		' */',
		''].join('\n');


gulp.task('JS', function() {
	return gulp
		.src('src/block-slider.js')
		.pipe(plumber())
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(babel())
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(header(banner))
		.pipe(gulp.dest('dist'))
});

gulp.task('default', ['JS']);