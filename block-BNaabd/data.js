const http = require("http");
const qs = require("querystring");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];

	let data = "";

	req.on("data", (chunk) => {
		data += chunk;
	});

	req.on("end", () => {
		if (contentType === "application/x-www-form-urlencoded") {
			const parsedJSON = qs.parse(data);
			res.end(JSON.stringify(parsedJSON));
		} else if (contentType === "application/json") {
			res.end(data);
		} else {
			res.end("Working");
		}
	});
}

server.listen(7000, () => {
	console.log("Server Running at PORT 7000");
});
