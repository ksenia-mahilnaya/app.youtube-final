module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + "/dist",
        filename: "bundle.js"
    },
    watch: true,
    watchOptions: {
        aggregateTimeout: 100
    },
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            }
        ]
    }
}
