const http = require("http");
const fs = require("fs").promises;
const mime = require("mime-types");

const PORT = 8080;

const server = http.createServer(async (req, res) => {
    let urlPath = "." + req.url;
    try {
        let file = await fs.readFile(urlPath);
        res.setHeader("Content-Type", mime.lookup(urlPath));
        res.end(file);
    } catch(err) {
        res.statusCode = 404;
        res.end("404 NOT FOUND");
    }

});

server.listen(PORT);