const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const types = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".png": "image/png",
};

http.createServer((request, response) => {
  const pathname = request.url === "/" ? "index.html" : request.url.split("?")[0];
  const file = path.join(root, pathname);

  response.setHeader("Content-Type", types[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file)
    .on("error", () => {
      response.statusCode = 404;
      response.end("Not found");
    })
    .pipe(response);
}).listen(4173, "127.0.0.1");
