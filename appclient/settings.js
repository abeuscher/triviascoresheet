var srcDir = "./src/";
var buildDir = "./public_html/";

var jsSrcDir = srcDir + "client-js/";
var jsBuildDir = buildDir + "js/";

var adminjsSrcDir = srcDir + "admin-js/";
var loginjsSrcDir = srcDir + "login-js/";
var lobbyjsSrcDir = srcDir + "lobby-js/";
var audiojsSrcDir = srcDir + "audio-js/";

var sassSrcDir = srcDir + "scss/";
var sassBuildDir = buildDir + "css/";

var assetsSrcDir = srcDir + "public_transfer/";
var assetsBuildDir = buildDir;

var templateSrcDir = srcDir + "templates/";
var templateBuildDir = buildDir;


function siteSettings() {
  return {
    siteName: "Team Trivia App",
    directories:[buildDir, jsBuildDir],
    jsFiles: [
      {
        name: "Main Bundle",
        srcDir: jsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "bundle.js"
      },
      {
        name: "Admin Bundle",
        srcDir: adminjsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "admin-bundle.js"
      },
      {
        name: "Lobby Bundle",
        srcDir: lobbyjsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "lobby-bundle.js"
      },
      {
        name: "Login Bundle",
        srcDir: loginjsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "login-bundle.js"
      },
      {
        name: "Audio Bundle",
        srcDir: audiojsSrcDir,
        srcFileName: "app.js",
        buildDir: jsBuildDir,
        buildFileName: "audio-bundle.js"
      }
    ],
    templates: [
      {
        name: "Main Template Group",
        srcDir: templateSrcDir,
        buildDir: templateBuildDir
      },
    ],
    stylesheets: [
      {
        name: "Main Stylesheet",
        srcDir: sassSrcDir,
        buildDir: sassBuildDir
      },
    ],
    assets: [
      {
        name: "Main Public Assets",
        srcDir: [assetsSrcDir + "**/*"],
        buildDir: assetsBuildDir
      }
    ]
  };
}
module.exports = siteSettings;
