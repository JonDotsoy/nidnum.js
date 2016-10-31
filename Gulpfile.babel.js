const gutil = require("gulp-util");
const babel = require("gulp-babel");
const mocha = require("gulp-mocha");
const gulp = require("gulp");
const log = ::gutil.log;
const watch = ::gulp.watch;
const task = ::gulp.task;
const src = ::gulp.src;
const dest = ::gulp.dest;


const handleTaskError = function (error) {
	log(error.toString());
	this.emit("end");
}


// Test Task
task("test", () => src(["tests/**/*.js"]).
	pipe(mocha()).
	once("error", handleTaskError));

// Test Watch
task("test:watch", ["test"], () => {
	watch(["src/**/*.js", "tests/**/*.js"], ["test"]);
});

task("build", () => {
	process.env.NODE_ENV = "production";

	return src(["src/**/*.js"]).
		pipe(babel()).
		pipe(dest("."));
});
