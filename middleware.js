const http = require("http");
const url = require("url");
const PORT = 8000;

var server = http.createServer((req, res) => {
    var r = url.parse(req.url, true);
    // console.log(req.);
    res.end('hi I am server');
});

server.listen(PORT, () => console.log(`server is running http://localhost:${PORT}`));

