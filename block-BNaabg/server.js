const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const qs = require("querystring");

const userDir = path.join(__dirname, "/users/");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	const parsedURL = url.parse(req.url, true);
	const fileName = parsedURL.query.username + ".json";
	let userInfo = "";

	req.on("data", (chunk) => {
		userInfo += chunk;
	});

	req.on("end", () => {
		// Create User
		if (req.method == "POST" && req.url == "/users" && contentType == "application/x-www-form-urlencoded") {
			userInfo = qs.parse(userInfo);
			fs.open(userDir + `${userInfo.username}.json`, "wx", (err, fd) => {
				if (err) throw err;

				// Writing a data to created file

				fs.writeFile(
					fd,
					`{
            "name": "${userInfo.name}",
            "username": "${userInfo.username}",
            "email": "${userInfo.email}",
            "bio": "${userInfo.bio}"
          }`,
					"utf8",
					(err) => {
						if (err) throw err;
						console.log("Successful Written a File");

						// Closing a File Descriptor
						fs.close(fd, (err) => {
							if (err) throw err;

							res.writeHead(200, { "Content-Type": "text/plain" });
							res.end(`User Created`);
						});
					}
				);
			});
		}

		// Read User
		if (req.method == "GET" && parsedURL.pathname == "/users") {
			fs.readdir(userDir, (err, files) => {
				if (err) throw err;

				if (files.includes(fileName)) {
					fs.readFile(userDir + `/${fileName}`, (err, content) => {
						console.log(content.toString());
						res.writeHead(200, { "Content-Type": "application/json" });
						res.end(content.toString());
					});
				} else {
					res.writeHead(404, { "Content-Type": "text/plain" });
					res.end("User Not Found");
				}
			});
		}

		// Delete User
		if (req.method == "DELETE" && parsedURL.pathname == "/users") {
			fs.readdir(userDir, (err, files) => {
				if (err) throw err;

				if (files.includes(fileName)) {
					fs.unlink(userDir + `/${fileName}`, (err) => {
						if (err) throw err;
						res.writeHead(200, { "Content-Type": "text/plain" });
						res.end(`${fileName} Deleted`);
					});
				} else {
					res.writeHead(404, { "Content-Type": "text/plain" });
					res.end("User Not Found");
				}
			});
		}

		// Update User
		if (req.method == "PUT" && parsedURL.pathname == "/users") {
			userInfo = qs.parse(userInfo);
			fs.readdir(userDir, (err, files) => {
				if (err) throw err;

				if (files.includes(fileName)) {
					fs.open(userDir + fileName, "r+", (err, fd) => {
						if (err) throw err;

						// truncating a file
						fs.ftruncate(fd, 0, (err) => {
							if (err) throw err;
							console.log(userInfo);

							// Writing a data to created file
							fs.writeFile(
								fd,
								`{
                  "name": "${userInfo.name}",
                  "username": "${userInfo.username}",
                  "email": "${userInfo.email}",
                  "bio": "${userInfo.bio}"
                }`,
								"utf8",
								(err) => {
									if (err) throw err;
									console.log("Successful Updated a File");

									// Closing a File Descriptor
									fs.close(fd, (err) => {
										if (err) throw err;

										res.writeHead(200, { "Content-Type": "text/plain" });
										res.end(`User Updated`);
									});
								}
							);
						});
					});
				} else {
					res.writeHead(404, { "Content-Type": "text/plain" });
					res.end("User Not Found");
				}
			});
		}
	});
}

server.listen(3000, () => {
	console.log("Server Running on PORT 3000");
});
