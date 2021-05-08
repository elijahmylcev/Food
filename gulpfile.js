const gulp = require("gulp");
const webpack = require("webpack-stream");
const sass = require("gulp-sass");
const autoprefixer = require("autoprefixer");
const cleanCSS = require("gulp-clean-css");
const postcss = require("gulp-postcss");
const browsersync = require("browser-sync");
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const dist = "./dist";

gulp.task("copy-html", () => {
  return gulp.src("./src/index.html")
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
  return gulp.src("./src/js/script.js")
    .pipe(webpack({
      mode: 'development',
      output: {
        filename: 'script.js'
      },
      watch: false,
      devtool: "source-map",
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: true,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist + '/js'))
    .pipe(browsersync.stream());
});

gulp.task("build-sass", () => {
  return gulp.src("./src/scss/**/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(dist + '/css'))
    .pipe(browsersync.stream());
});

gulp.task("copy-assets", () => {
  gulp.src("./src/icons/**/*.*")
    .pipe(gulp.dest(dist + "/icons"));

  return gulp.src("./src/img/**/*.*")
    .pipe(gulp.dest(dist + "/img"))
    .pipe(browsersync.stream());
});

gulp.task("watch", () => {
  browsersync.init({
    server: "./dist/",
    port: 4000,
    notify: true
  });

  gulp.watch("./src/index.html", gulp.parallel("copy-html"));
  gulp.watch("./src/icons/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./src/img/**/*.*", gulp.parallel("copy-assets"));
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("build-sass"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.parallel("copy-html", "copy-assets", "build-sass", "build-js"));

gulp.task("prod", () => {
  gulp.src("./src/index.html")
    .pipe(gulp.dest(dist));
  gulp.src("./src/img/**/*.*")
    .pipe(gulp.dest(dist + "/img"));
  gulp.src("./src/icons/**/*.*")
    .pipe(gulp.dest(dist + "/icons"));

  gulp.src("./src/js/main.js")
    .pipe(webpack({
      mode: 'production',
      output: {
        filename: 'script.js'
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  debug: false,
                  corejs: 3,
                  useBuiltIns: "usage"
                }]
              ]
            }
          }
        }]
      }
    }))
    .pipe(gulp.dest(dist + '/js'));

  return gulp.src("./src/scss/style.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(cleanCSS())
    .pipe(gulp.dest(dist + '/css'));
});

gulp.task('deploy', function () {

  let conn = ftp.create({
    host: 'food.test',
    user: 'ftp',
    password: 'ftp',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'dist/**',
    '*.php'
    //     'css/**',
    //     'js/**',
    //     'img/**',
    //     // 'fonts/**',
    //     'index.html'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  return gulp.src(globs, {
      base: '.',
      buffer: false,
      allowEmpty: true
    })
    .pipe(conn.newer('./food.test/')) // only upload newer files
    .pipe(conn.dest('./food.test/'));

});
gulp.task("default", gulp.parallel("watch", "build"));