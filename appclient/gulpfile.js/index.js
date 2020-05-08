const settings = require("../settings.js")();
const bundleJS = require("./bundle-js.js");
const processCss = require("./process-css.js");
const buildTemplates = require("./build-templates.js");
const moveFiles = require("./move-files.js");

const checkDir = require("./check-dir.js");

const { series } = require('gulp');

const mode = require('gulp-mode')({
  modes: ["production", "development"],
  default: "development",
  verbose: false
});

function defaultTask(cb) {
  mode.development(() => { console.log("Begin processing " + settings.siteName) })
    for (i=0;i<settings.directories.length;i++) {
      checkDir(settings.directories[i])
    }
    cb()
  }
  let endTask = cb => {
    cb()
    return true
    
  }
exports.default = series(defaultTask,bundleJS,processCss,buildTemplates, moveFiles, endTask);