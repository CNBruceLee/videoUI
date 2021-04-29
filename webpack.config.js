const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

//设置node.js为开发环境 默认为生产环境
// process.env.NODE_ENV = "development"

module.exports = {
    entry: './src/js/index.js',
    output: {
        filename: 'js/videoUI.js',
        path: path.resolve(__dirname, 'build'),
        // publicPath: './' //运行时寻找资源的路径
    },
    devtool: 'inline-source-map',//追踪错误原始位置
    module: {
        rules: [
            /*
            js兼容处理：babel-loader
            1、基础兼容处理：@babel/preset-env  不能深层次兼容
            2、全部兼容处理：@babel/polyfill 问题:只要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大了
            3、需要做兼容性处理就做：按需加载 corejs
             */
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                //按需加载
                                useBuiltIns: "usage",
                                corejs: {
                                    version: 3
                                },
                                //制定兼容性做到那个版本的浏览器
                                targets: {
                                    chrome: "60",
                                    firefox: "60",
                                    ie: "9",
                                    safari: "10",
                                    edge: "17"
                                }
                            }
                        ]
                    ]
                }
            },
            {
                test: /\.css$/,
                //use数组中的执行顺序 从右到左，从下到上 依次执行
                use: [
                    // 'style-loader',
                    //取代style-loader 提取css为单独文件夹
                    MiniCssExtractPlugin.loader,
                    // 'css-loader',
                    {
                        loader: "css-loader",
                        options: {
                            importLoaders: 1,
                        }
                        // 上面这句话的意思为如果css中有import进来的文件也进行处理
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-preset-env")()
                            ]
                        }
                    }

                ]
            },
            {
                test: /\.less$/,
                use: [
                    // 'style-loader',
                    MiniCssExtractPlugin.loader,
                    // 'css-loader',
                    {
                        loader: "css-loader",
                        options: {importLoaders: 2}
                        // 上面这句话的意思为如果css中有import进来的文件也进行处理
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-preset-env")()
                            ]
                        }
                    },
                    //需要先处理 less-loader 在运行css的兼容性
                    'less-loader',
                ]
            },
            // {
            //     test: /\.(jpg|png|gif|mp4)$/,
            //     loader: 'file-loader',
            //     options: {
            //         name: '[name].[ext]',
            //         outputPath: 'media/'
            //     }
            // },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    // name: '[hash:10].[ext]',
                    name: 'videoUI-' + '[name].[ext]',
                    // useRelativePath: true,//设置为相对路径
                    publicPath: '../iconfont/',
                    outputPath: 'iconfont/',
                },
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'html/demo1_pc.html',
            template: './src/html/demo1_pc.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'html/demo2_pc.html',
            template: './src/html/demo2_pc.html',
        }),
        new HtmlWebpackPlugin({
            filename: 'html/demo_mc_dev.html',
            template: './src/html/demo_mc_dev.html',
        }),

        //提取css生产单独文件
        new MiniCssExtractPlugin({
            filename: 'css/videoUI.css',     //生成html文件的文件名，默认是main.css
        }),

        //压缩css
        // new OptimizeCssAssetsWebpackPlugin(),

        //复制静态资源
        new CopyWebpackPlugin([
            {from: 'media/', to: 'media'},
        ]),
    ],
    // externals: {
    //     jquery: 'jQuery',
    // },
    // mode: "production",
    mode: "development",
    //npx webpack-dev-server
    devServer: {
        contentBase: [
            path.resolve(__dirname, 'build'),
        ],
        openPage: 'html/demo1_pc.html',
        compress: true, //启用gzip压缩
        useLocalIp: true,//使用本机IP地址
        host: '0.0.0.0',//监听本机所有的IP 可通过IP地址访问
        port: 8080,//端口号8080
        open: true,//自动打开浏览器
    },

};
