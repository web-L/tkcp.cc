/*
* @Author: Administrator
* @Date:   2017-07-11 15:47:07
* @Last Modified by:   Administrator
* @Last Modified time: 2017-08-30 14:53:51
*/

var gulp = require('gulp');
var fileinclude  = require('gulp-file-include'),
	uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),// css 样式压缩
    htmlmin = require('gulp-htmlmin'), // html 压缩
    concatCss = require('gulp-concat-css'),// 样式合并
    imagemin = require('gulp-imagemin'), // 图片压缩
    pngquant = require('imagemin-pngquant'), // 图片深度压缩
    rename = require('gulp-rename'), // 文件重命名
    rev = require('gulp-rev'),// 生成json对照表
    concat = require('gulp-concat'),// js 合并
    clean = require('gulp-clean'),// 删除目录
    livereload = require('gulp-livereload'),// 刷新页面
    htmlreplace = require('gulp-html-replace'); // 替换html内容


// 资源路径
var cssSrc = 'css/*.css',
    cssMinSrc = 'dist/css/',
    jsSrc = 'js/*.js',
    jsMinSrc = 'dist/js/',
    lessSrc = 'less/*.less',
    imgSrc = './images/**/*.{png,jpg,gif,svg}',
    imgMinSrc = 'dist/images/',
    htmlSrc = 'dist/*.html',
    htmlMinSrc = 'dist/';

/*
 *
 * include
 *
 */
gulp.task('include', function() {
    gulp.src('./*.html')
        .pipe(fileinclude({
          prefix: '@@',
          basepath: '@file'
        }))
    .pipe(gulp.dest('dist'))
    .pipe(livereload());
});

/*
 *
 * 压缩 img
 *
 */
gulp.task('imgMin', function(){
  return gulp.src(imgSrc) // 指明源文件路径、并进行文件匹配
    .pipe(imagemin({
      progressive: true, // 无损压缩JPG图片
      svgoPlugins: [{removeViewBox: false}], // 不移除svg的viewbox属性
      use: [pngquant()] // 使用pngquant插件进行深度压缩
    }))
    .pipe(gulp.dest(imgMinSrc)); // 输出路径
});
/*
 *
 * 压缩 js
 *
 */
gulp.task('jsMin',function(){
    gulp.src(jsSrc)//找到js文件
    .pipe( uglify() )
    .pipe( gulp.dest(jsMinSrc) )
});
/*
 *
 * 压缩 css
 *
 */
gulp.task('cssMin', function() {
    return gulp.src(cssSrc)      //压缩的文件
        .pipe(minifyCss())  //执行压缩
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());   //输出文件夹
});

/*
 *
 * 压缩html
 *
 */
gulp.task('htmlMin',function(){
    var options = {
        collapseWhitespace:true,   //从字面意思应该可以看出来，清除空格，压缩html，这一条比较重要，作用比较大，引起的改变压缩量也特别大。
        collapseBooleanAttributes:true,   //省略布尔属性的值，比如：<input checked="checked"/>,那么设置这个属性后，就会变成 <input checked/>。
        removeComments:true,   //清除html中注释的部分，我们应该减少html页面中的注释。
        removeEmptyAttributes:true,   //清除所有的空属性。
        removeScriptTypeAttributes:true,   //清除所有script标签中的type="text/javascript"属性。
        removeStyleLinkTypeAttributes:true,   //清楚所有Link标签上的type属性。
        minifyJS:true,   //压缩html中的javascript代码。
        minifyCSS:true   //压缩html中的css代码。
    };
    return gulp.src(htmlSrc)
      .pipe(htmlmin(options))
      .pipe(gulp.dest(htmlMinSrc));
});

gulp.task('watch',function(){
    livereload.listen();
    gulp.watch('./*.html',['include','htmlMin']);
    gulp.watch('./css/*.css',['cssMin']);
});