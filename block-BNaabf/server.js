const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	let data = "";

	req.on("data", (chunk) => {
		data += chunk;
	});

	req.on("end", () => {
		if (req.url == "/form" || req.url == "/form.html") {
			if (req.method === "GET") {
				fs.readFile("./form.html", (err, content) => {
					if (err) throw err;
					res.writeHead(200, { "Content-Type": "text/html" });
					res.end(content);
				});
			}

			if (req.method === "POST" && contentType === "application/x-www-form-urlencoded") {
				const parsedData = qs.parse(data);
				res.writeHead(200, { "Content-Type": "text/json" });
				res.end(`
        <h2>FORM OUTPUT</h2>
        <p>${parsedData.name}</p>
        <p>${parsedData.email}</p>
        <p>${parsedData.age}</p>
        `);
			}
		} else {
			res.writeHead(404, { "Content-Type": "text/plain" });
			res.end("Page Not Found");
		}
	});
}

server.listen(5678, () => {
	console.log("Server Running on PORT 5678");
});
