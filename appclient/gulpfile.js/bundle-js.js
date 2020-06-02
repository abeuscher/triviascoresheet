const settings = require("../settings.js")()

const fs = require("file-system")
const browserify = require("browserify")
const uglify = require("gulp-uglify-es").default
const extReplace = require("gulp-ext-replace")

const { src, dest, watch } = require("gulp")

const findDirMatch = require("./find-dir-match.js")

const mode = require('gulp-mode')()
const devFlag = mode.development()

function bundleJS(cb) {

  let watcher = devFlag ? watch([settings.jsFiles[0].srcDir + "*", settings.jsFiles[0].srcDir + "**/*"]) : {};

  bundleFile(settings.jsFiles[0]);

  // Loops through the js files, bundles them, and adds their source folders to the watcher
  for (let i = 1; i < settings.jsFiles.length; i++) {

    bundleFile(settings.jsFiles[i])
    if (devFlag) {
      watcher.add([
        settings.jsFiles[i].srcDir + "*", settings.jsFiles[i].srcDir + "**/*"
      ])
    }
  }

  // Add the listener event to the watcher
  if (devFlag) {

    watcher.on("change", triggerJS)

  }

  cb()

}

// This is the listener event, which finds the changed file then passes it to the bundler
function triggerJS(path, stats) {

  let p = path.indexOf("\\") > -1 ? path.split("\\") : path.split("/")
  let file = findDirMatch(settings.jsFiles, p)

  for (let i = 0; i < file.length; i++) {
    bundleFile(file[i])
  }

}

// Bundler function. 
function bundleFile(f) {
  console.log("Begin processing JS file " + f.name)

  browserify({
    entries: f.srcDir + f.srcFileName,
    debug: true
  })
    .transform('babelify', {
      presets: [[
        "@babel/preset-env",
        {
          useBuiltIns: "entry",
          corejs: '2.0.0'
        }
      ], "@babel/preset-react"], plugins: [require("babel-plugin-transform-react-pug"), require("@babel/plugin-proposal-class-properties")]
    })
    //.transform("uglifyify", { global: true })
    .bundle()
    .on('error', function (err) {

      console.log("ERROR ON:" + f.name + "\nERROR:", err.stack)
      return false;

    })
    .pipe(
      fs
        .createWriteStream(f.buildDir + f.buildFileName)
        .on("close", function () {

          console.log("Finished Processing JS File " + f.name)

          if (!devFlag) {
           // minifyJS(f)
          }
        })
    );
}

//Minify fires after fire is written and creates a second, smaller file. Hence the term "minify".
function minifyJS(f) {
  src(f.buildDir + f.buildFileName)
    .pipe(uglify())
    .pipe(extReplace(".min.js"))
    .pipe(
      dest(f.buildDir));
}
module.exports = bundleJS;
