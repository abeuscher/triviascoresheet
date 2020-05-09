const settings = require("../settings.js")();

const sass = require('gulp-sass')
const cssmin = require('gulp-cssmin')
const autoprefixer = require('gulp-autoprefixer')
const wait = require("gulp-wait")

const mode = require('gulp-mode')()
const devFlag = mode.development()

const { src, dest, watch } = require('gulp')

var findDirMatch = require("./find-dir-match.js")

function processCSS(cb) {

  let watcher = devFlag ? watch([settings.stylesheets[0].srcDir + "*.scss"]) : {}

  buildCss(settings.stylesheets[0]);

  for (i = 1; i < settings.stylesheets.length; i++) {

    buildCss(settings.stylesheets[i])

    if (devFlag) {
      watcher.add([settings.stylesheets[i].srcDir + "*.scss"])
    }

  }

  if (devFlag) {

    watcher.on("change", triggerCss)

  }

  cb();
}

function triggerCss(path, stats) {
  // Parse the path
  var p = path.split("\\");
  var thisSheet = findDirMatch(settings.stylesheets, p);
  buildCss(thisSheet[0]);
}

function buildCss(s) {
  console.log("Processing Style sheet group " + s.name)
  src(s.srcDir + '*.scss')
    .pipe(wait(200))
    .pipe(sass({
      outputStyle: "compressed"
    }))
    .on('error', error => {

      console.log("CSS ERROR", error);
      this.emit('end');

    })
    .pipe(autoprefixer())
    .pipe(cssmin({
      keepSpecialComments: true
    }))
    .pipe(dest(s.buildDir).on("end", () => { console.log("Finished Processing stylesheet set " + s.name)  }));
}

module.exports = processCSS;