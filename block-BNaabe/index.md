## BLOCK-writeCode

#### Path
Q. Suppose we have 3 files inside a directory on desktop
The structure is
  - node(folder)
    - app.js
    - server.js
    - index.html
You are currently inside server.js

Write code to 
- capture absolute path of `server.js`(itself)
- get absolute path of `app.js`
- get realtive path of `index.html`
- get absolute path of `index.html` using `path module` 

```js
const path = require("path");

const absolutePathServerJS = __dirname;
const absolutePathAppJS = __dirname;
const relativePathIndexHTML = "./index.html";

// Using Node Path Module

const absPath = path.dirname(__dirname) + "/node";
```

#### Capture data on server

Q. Create a server using http
- handle post method on '/' route
- send json data on it from postman

```js
// data format is
{
  team: 'kxip',
  players: 18,
  captain: 'KL Rahul'
}
```
- capture data from request on server side using data and end event on request object
- when end event fires, send entire captured data in response with status code 201.

```js
const http = require("http");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
  const contentType = req.headers["content-type"];
	let receivedData = "";

	req.on("data", (chunk) => {
		receivedData += chunk;
	});

	req.on("end", () => {
		if (req.method == "POST" && contentType == "application/json") {
			res.writeHead(201, { "Content-Type": contentType });
			res.end(receivedData);
		} else {
			res.end("Running");
		}
	});
}

server.listen(3000);
```

Q. Follow above steps with form data from postman instead of json data.
- once data has been captured, send only captain's name in response.

```js
const http = require("http");
const qs = require("querystring");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	let receivedData = "";

	req.on("data", (chunk) => {
		receivedData += chunk;
	});

	req.on("end", () => {
		if (req.method == "POST" && contentType == "application/x-www-form-urlencoded") {
			const parsedJSON = qs.parse(receivedData);
			res.writeHead(201, { "Content-Type": contentType });
			res.end(parsedJSON.caption);
		} else {
			res.end("Running");
		}
	});
}

server.listen(3000);
```

Q. Create server which can handle both json/form data without specifying which format of data is being received.
- add listener on port 9000
- use `data/end` event to capture json/form data
- use `req.headers['Content-Type']` to check data format
- parse respective data format i.e. json/form 
- send entire data in response
- data sent from postman should have fields:
  - city
  - state
  - country
  - pin

```js
const http = require("http");
const qs = require("querystring");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	let receivedData = "";

	req.on("data", (chunk) => {
		receivedData += chunk;
	});

	req.on("end", () => {
		if (req.method == "POST" && contentType == "application/x-www-form-urlencoded") {
			const parsedJSON = qs.parse(receivedData);
			res.writeHead(201, { "Content-Type": contentType });
			res.end(JSON.stringify(parsedJSON));
		} else if (req.method == "POST" && contentType == "application/json") {
			res.writeHead(201, { "Content-Type": contentType });
			res.end(receivedData);
		} else {
			res.writeHead(201, { "Content-Type": "text/plain" });
			res.end("Working");
		}
	});
}

server.listen(9000);
```

Q. create server, send json data in request from postman, parse in on the server and send html response with entire parsed data information.
- format of json data is {name: your name, email: "", }
- Html response format is <h1>Name</h1><h2>email</h2>


```js
const http = require("http");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	let receivedData = "";

	req.on("data", (chunk) => {
		receivedData += chunk;
	});

	req.on("end", () => {
		if (req.method == "POST" && contentType == "application/json") {
			const parsedJSON = JSON.parse(receivedData);
			res.writeHead(201, { "Content-Type": "text/html" });
			res.end(`<h1>${parsedJSON.name}</h1><h2>${parsedJSON.email}</h2>`);
		} else {
			res.writeHead(201, { "Content-Type": "text/plain" });
			res.end("Working");
		}
	});
}

server.listen(9000);
```

Q. Follow above question with form data containing fields i.e name and email. 
- Parse form-data using `querystring` module
- respond with HTML page containing only email from data in H2 tag.

```js
const http = require("http");
const { parse } = require("path");
const qs = require("querystring");

const server = http.createServer(reqHandler);

function reqHandler(req, res) {
	const contentType = req.headers["content-type"];
	let receivedData = "";

	req.on("data", (chunk) => {
		receivedData += chunk;
	});

	req.on("end", () => {
		if (req.method == "POST" && contentType == "application/x-www-form-urlencoded") {
			const parsedJSON = qs.parse(receivedData);
			res.writeHead(201, { "Content-Type": "text/html" });
			res.end(`<h2>${parsedJSON.email}</h2>`);
		} else {
			res.writeHead(201, { "Content-Type": "text/plain" });
			res.end("Working");
		}
	});
}

server.listen(9000);
```

#### Note:- 
Make sure to convert objects into strings using `JSON.stringify` before passing the data through response.