'use strict';

const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const concatCss = require('gulp-concat-css');
const reload = browserSync.reload;
const pug = require('gulp-pug2');
const babel = require('gulp-babel');
const minify = require('gulp-minify');


gulp.task('minify-js', () => {
    gulp.src('js/babel/*.js')
        .pipe(minify({
            ext: {
                src: '.debug.js',
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('js/babel/'))
});




gulp.task('babel', () => {
    return gulp.src('js/script.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js/babel'));
});


gulp.task('pug', () => {
    return gulp.src('pug/index.pug')
        .pipe(pug({ yourTemplate: 'Locals' }))
        .pipe(gulp.dest(''))
        .pipe(reload({stream:true}));
});



const paths = {
    html:['index.html'],
    css:['css/*.css'],
    scss:['css/style.scss'],
    pug:['pug/*.pug']
};


gulp.task('html', () => {
    gulp.src(paths.html)
        .pipe(reload({stream:true}));
});


gulp.task('sass', () => {
    return gulp.src('css/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('css'))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

gulp.task('browserSync', () => {
    browserSync({
        server: {
            baseDir: "./"
        },
        port: 8080,
        open: true,
        notify: false
    });
});


gulp.task('concat', () => {
    return gulp.src('css/*.css')
        .pipe(concatCss("bundle.css"))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('css/'));
});



gulp.task('watcher', () => {
    gulp.watch(paths.scss, ['sass']);
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.pug, ['pug']);
});

gulp.task('default', ['watcher', 'sass', 'browserSync', 'pug']);
