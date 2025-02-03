import nodeExternals from "webpack-node-externals";
import path from "path"

export default {
    entry: "./index.ts",
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
        modules: ["app"],
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "app.cjs",
        path: path.resolve(__dirname, "dist", "server")
    }
};
