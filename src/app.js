// Loading all the dependencies
require("./db/mongoose");
const express = require("express");
const app = express();

// Loading all the models
const User = require("./models/users");

const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/users", (req, res) => {
	const user = new User(req.body);
	user.save()
		.then(() => {
			res.send(user);
		})
		.catch((error) => {
			res.send(error);
		});
});

app.listen(port, () => {
	console.log("Server is listening at port: " + port);
});
