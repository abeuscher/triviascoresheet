const settings = require("../settings.js")();

const mode = require('gulp-mode')({
    modes: ["production", "development"],
    default: "development",
    verbose: false
})

const { src, dest, watch } = require('gulp');

const findDirMatch = require("./find-dir-match.js");

function moveFiles(cb) {

    let watcher = {}

    mode.development(() => {

        watcher = watch([settings.assets[0].srcDir + "*", settings.assets[0].srcDir + "**/*"])
    })

    moveFileset(settings.assets[0])

    for (i = 1; i < settings.assets.length; i++) {

        moveFileset(settings.assets[i])

        mode.development(() => {

            watcher.add([settings.assets[i].srcDir + "*", settings.assets[i].srcDir + "**/*"])

        })
    }
    mode.development(() => {
        watcher.on("change", triggerMove)
    })
    cb()
}
function triggerMove(path, stats) {
    // Parse the path
    let p = path.split("\\")
    let fileSet = findDirMatch(settings.assets, p)
    moveFileSet(fileSet[0])
}
function moveFileset(f) {
    mode.development(() => {
        console.log("Moving file set " + f.name)
    })
    src(f.srcDir)
        .pipe(
            dest(f.buildDir)
                .on("end", function () {
                    mode.development(
                        () => {
                            console.log("Finished Moving File set " + f.name)
                        })
                })
        )
}
module.exports = moveFiles;