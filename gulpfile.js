var gulp = require('gulp');
    nodemon = require('gulp-nodemon'),
    gulpMocha = require('gulp-mocha');

    gulp.task('default', function(){
        nodemon({
            script: 'index.js',
            ext: 'js',
            env: {
                PORT:8000
            },
            ignore: ['./node_modules/**']
        })
        .on('Restarting', function(){
            console.log('restarted');
        });
    });

    gulp.task('test', function(){
        gulp.src('tests/*.js', {read: false})
            .pipe(gulpMocha({reporter: 'nyan'}))
    });