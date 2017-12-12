var gulp = require('gulp');
    nodemon = require('gulp-nodemon');

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