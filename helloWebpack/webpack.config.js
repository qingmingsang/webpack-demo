module.exports = {
    entry: "./react.js",
    output: {
        path: __dirname,
        filename: "react_pack.js"
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "babel"}
        ]
    }
};