const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
    entry: "./src/index.ts",
    target: "node",
    externals: [nodeExternals()],
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        modules: ["src"],
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist")
    }
};
