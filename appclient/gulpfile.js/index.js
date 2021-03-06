const settings = require("../settings.js")()
const bundleJS = require("./bundle-js.js")
const processCss = require("./process-css.js")
const buildTemplates = require("./build-templates.js")
const moveFiles = require("./move-files.js")

const checkDir = require("./check-dir.js")

const { series } = require('gulp')

const mode = require('gulp-mode')()
const devFlag = mode.development()

function defaultTask(cb) {

  let modeString = devFlag ? "dev mode" : "prod mode"

  console.log("Begin processing " + settings.siteName + " in " + modeString)

  for (i = 0; i < settings.directories.length; i++) {
    checkDir(settings.directories[i])
  }
  cb()
}

exports.default = series(defaultTask, bundleJS, processCss, buildTemplates, moveFiles);