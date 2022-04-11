const nodemon = require("nodemon");
const { copyFileSync } = require("fs");
const { join } = require("path");
const { exec } = require("child_process");

exec(
  "npx swc ./server -d build/server -w --config-file .swcrc",
  (error, stdout, stderr) => {
    if (error) {
      console.error(`${error}`);
      return;
    }
    console.log(`${stdout}`);
    console.error(`${stderr}`);
  }
);

nodemon({
  script: "build/server/index.js",
  args: ["start"],
  watch: ["build/server", "scripts", "package.json"],
});

nodemon
  .on("start", () => {
    console.log(`[nodemon][${new Date().toLocaleString()}] starting server...`);
  })
  .on("restart", () => {
    console.log(
      `[nodemon][${new Date().toLocaleString()}] restarting server due to changes...`
    );
  });

const livereload = require("livereload");
const lrServer = livereload.createServer();

const dir = join(__dirname, "../build/frontend");
lrServer.watch(dir);

const connect = require("connect");
const static = require("serve-static");

const server = connect();
server.use(static(dir));
server.listen(12139);

require("esbuild")
  .build({
    entryPoints: ["frontend/index.tsx"],
    bundle: true,
    sourcemap: true,
    watch: {
      onRebuild(error) {
        const time = new Date().toLocaleTimeString();
        if (error) {
          console.error(`[esbuild][${time}] build failed with error: ${error}`);
        } else {
          console.log(
            `[esbuild][${time}] successfully completed an incremental build!`
          );
          console.log(`[esbuild][${time}] watching for file changes...`);
        }
      },
    },
    loader: {
      ".png": "dataurl",
      ".svg": "file",
      ".css": "css",
    },
    outdir: "build/frontend",
  })
  .then(() => {
    copyFileSync("frontend/index.html", "build/frontend/index.html");
    console.log(
      `[esbuild][${new Date().toLocaleTimeString()}] watching for file changes...`
    );
  });
