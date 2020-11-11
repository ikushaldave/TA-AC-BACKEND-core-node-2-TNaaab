const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
	fs.createReadStream("./readme.txt").pipe(res);
});

server.listen(3000, () => {
	console.log("Server Running on PORT 3000");
});
