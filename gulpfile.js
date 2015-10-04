var gulp = require('gulp'),
    pkg = require('./package.json'),
    uglify = require('gulp-uglify'),
    esLint = require('gulp-eslint'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    babel = require('gulp-babel'),
    livereload = require('gulp-livereload'),
    sourcemaps = require('gulp-sourcemaps'),
    header = require('gulp-header'),
    banner = ['/**',
        ' * Block Slider a responsive autoslide component.',
        ' * v. 0.1.2',
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
        .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
            .pipe(header(banner))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

gulp.task('default', ['JS'], function() {
    livereload.listen();
    gulp.watch('src/block-slider.js', ['JS']);
});