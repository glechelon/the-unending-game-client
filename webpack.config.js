module.exports = {
    watch: true,
    entry: [
        './src/app.js'
    ],
    output: {
        path: __dirname +'/dist/',
        publicPath: '/dist/',
        filename: 'main.js'
    },
    module: {
    },
    devServer: {
        writeToDisk: true
    }
    };
