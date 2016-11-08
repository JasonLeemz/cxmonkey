/**
 * Created by jason on 2016/11/8.
 */
// var webpack = require('webpack');
// var WebpackDevServer = require("webpack-dev-server");
// var path = require('path');
// var CURRENT_PATH = path.resolve(__dirname); // 获取到当前目录
// var ROOT_PATH = path.join(__dirname, '../'); // 项目根目录
// var MODULES_PATH = path.join(ROOT_PATH, './node_modules'); // node包目录
// var BUILD_PATH = path.join(ROOT_PATH, './dist'); // 最后输出放置公共资源的目录
//
// //用于提取多个入口文件的公共脚本部分，然后生成一个 common.js 来方便多页面之间进行复用
// var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');

var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var proxy = require('proxy-middleware');

module.exports = {
    //
    // //项目的文件夹 可以直接用文件夹名称 默认会找index.js ，也可以确定是哪个文件名字
    // entry: [
    //     './app.js'
    // ],
    //
    // //输出的文件名,合并以后的js会命名为bundle.js
    // output: {
    //     path: path.join(__dirname, "dist/"),
    //     publicPath: "http://localhost:8088/dist/",
    //     filename: "bundle.js"
    // },
    devServer: {
        historyApiFallback: true,
        contentBase: "./",
        quiet: false, //控制台中不输出打包的信息
        noInfo: false,
        hot: true,
        inline: true,
        lazy: false,
        progress: true, //显示打包的进度
        watchOptions: {
            aggregateTimeout: 300
        },
        port: '8088'
    }
};