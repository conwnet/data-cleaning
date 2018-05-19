const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}) => {
    const mode = env.production ? 'production' : 'development';

    process.env.NODE_ENV = mode;
    return {
        entry: path.resolve(__dirname, './renderer/index.js'),
        output: {
            filename: 'bundle.js',
            path: path.resolve(__dirname, './dist')
        },
        target: 'electron-renderer',
        mode,
        module: {
            rules: [{
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.less$/,
                use: ['style-loader', 'css-loader?modules&camelCase', 'less-loader?javascriptEnabled']
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({template: path.resolve(__dirname, './index.tpl.html')})
        ],
        devtool: mode === 'production' ? 'source-map' : 'cheap-module-eval-source-map'
    }
};
