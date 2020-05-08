const settings = require("../settings.js")();

const sass = require('gulp-sass');
const cssmin = require('gulp-cssmin');
const autoprefixer = require('gulp-autoprefixer');
const wait = require("gulp-wait");
const mode = require('gulp-mode')({
  modes: ["production", "development"],
  default: "development",
  verbose: false
})
const { src, dest, watch } = require('gulp');

var findDirMatch = require("./find-dir-match.js");

function processCSS(cb) {

    let watcher = {}
  
    mode.development(() => {
  
      watcher = watch([settings.stylesheets[0].srcDir + "*.scss"])
  
    })

    buildCss(settings.stylesheets[0]);

    for (i=1;i<settings.stylesheets.length;i++) {

      buildCss(settings.stylesheets[i]);
      mode.development(() => {
      watcher.add([settings.stylesheets[i].srcDir + "*.scss"]);
      })
    }
    mode.development(() => {
    watcher.on("change", triggerCss);
    })
    cb();
}
function triggerCss(path, stats) {
  // Parse the path
  var p = path.split("\\");
  var thisSheet = findDirMatch(settings.stylesheets,p);
  buildCss(thisSheet[0]); 
}
function buildCss(s) {
  mode.development(() => {console.log("Processing Style sheet group " + s.name)})
  src(s.srcDir + '*.scss')
  .pipe(wait(200))
  .pipe(sass({
    outputStyle: "compressed"
  }))
  .on('error', function(error) {
    console.log(error);
    this.emit('end');
  })
  .pipe(autoprefixer())
  .pipe(cssmin({
    keepSpecialComments: true
  }))
  .pipe(dest(s.buildDir).on("end", function() {   mode.development(() => {console.log("Finished Processing stylesheet set " + s.name)})}));
}

module.exports = processCSS;