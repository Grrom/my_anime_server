const path = require('path');

module.exports = {
    target: 'node',
    mode: "production",
    entry: './src/main.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, 'bundle'),
        filename: 'bundle.js',
    },
    optimization: {
        minimize: true,
    },
};