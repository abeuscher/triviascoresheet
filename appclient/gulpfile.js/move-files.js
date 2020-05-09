const settings = require("../settings.js")();

const mode = require('gulp-mode')()
const devFlag = mode.development()

const { src, dest, watch } = require('gulp');

const findDirMatch = require("./find-dir-match.js");

function moveFiles(cb) {

    let watcher = devFlag ? watch([settings.assets[0].srcDir + "*", settings.assets[0].srcDir + "**/*"]) : {}

    moveFileset(settings.assets[0])

    for (i = 1; i < settings.assets.length; i++) {

        moveFileset(settings.assets[i])

        if (devFlag) {
            watcher.add([settings.assets[i].srcDir + "*", settings.assets[i].srcDir + "**/*"])
        }
        
    }
    if (devFlag) {
        watcher.on("change", triggerMove)
    }

    cb()
}
function triggerMove(path, stats) {
    // Parse the path
    let p = path.split("\\")
    let fileSet = findDirMatch(settings.assets, p)
    moveFileSet(fileSet[0])
}
function moveFileset(f) {
    console.log("Moving file set " + f.name)
    src(f.srcDir)
        .pipe(
            dest(f.buildDir)
                .on("end", () => { console.log("Finished Moving File set " + f.name) })
        )
}
module.exports = moveFiles;