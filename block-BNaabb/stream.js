const http = require("http");

const server = http.createServer(requestHandler);

function requestHandler(req, res) {
	let data = "";

	req.on("data", (chunk) => {
		data += chunk;
	});

	req.on("end", () => {
		console.log(data);
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end(data);
	});
}

server.listen(3456, () => {
	console.log("Server Running at PORT 3456");
});
