var gulp = require("gulp"),
    execSync = require("child_process").execSync,
    exec = require("child_process").exec;

gulp.task("default", function() {

});

gulp.task("build", function() {
    /** RequireJS(r.js) build **/
    exec("r.js -o tools/app.build.js", function(err, stdout, stderr) {
        gutil.log(stdout);
        gutil.log(stderr);
    });
});

var lodashUpdate = function() {
    /** Lodash custom build **/
    var lodashTargetPath = "public/scripts/vendor/lodash";

    console.log("Lodash updating...");
    execSync("lodash modern modularize --output " + lodashTargetPath,
        function(err, stdout, stderr) {
            console.log(stdout);
            console.error(stderr);
        });
    console.log("Lodash updated. Path: " + lodashTargetPath);
};

gulp.task("lodash_update", function() {
    lodashUpdate();
});

gulp.task("hint", function() {
    var jshint = require("gulp-jshint");

    return gulp.src(["public/scripts/app/**.js"])
        .pipe(jshint("tools/.jshintrc"))
        .pipe(jshint.reporter("jshint-stylish"));
});

gulp.task("test", function() {
    var mocha = require('gulp-mocha');

    return gulp.src("tests/end_to_end/**.js", {read: false})
        .pipe(mocha({reporter: "nyan"}));
});

gulp.task("install", function() {
    lodashUpdate();

    exec("bower install", function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });
})
