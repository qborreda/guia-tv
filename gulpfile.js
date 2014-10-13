var gulp = require('gulp'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    compass = require('gulp-compass'),
    minifycss = require('gulp-minify-css'),
    connect = require('gulp-connect'),
    notify = require('gulp-notify');

var paths = {
    js: ['_/js/vendor/*.js', '_/js/*.js'],
    // js: '_/js/*.js',
    jsout: 'scripts/',
    scss: '_/scss/*.scss',
    cssout: 'css/'
};

gulp.task('js', function() {
    gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.jsout))
        .pipe(connect.reload());
});

gulp.task('compass', function() {
    gulp.src(paths.scss)
        .pipe(compass({
            config_file: './config.rb',
            css: "css",
            sass: "_/scss",
            sourcemap: true
            //image: 'imgs'
        }))
        .pipe(minifycss())
    //.pipe(sourcemaps.init())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.cssout))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.scss, ['compass']);
});

gulp.task('connect', function() {
    connect.server({
        //root: './',
        port: 8080,
        livereload: true
    })
    //notify('Server running at http://localhost:8080/');
});

gulp.task('default', ['js', 'compass', 'watch', 'connect']);