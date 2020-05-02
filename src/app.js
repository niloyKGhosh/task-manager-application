// Loading all the dependencies
require("./db/mongoose");
const express = require("express");
const app = express();

// Loading all the models
const User = require("./models/users");
const Task = require("./models/tasks");

const port = process.env.PORT || 3000;

// Parses the incoming requests using json.
app.use(express.json());

// Endpoint to the users list in the database.
app.post("/users", (req, res) => {
	const user = new User(req.body);
	user.save()
		.then(() => {
			res.send(user);
		})
		.catch((error) => {
			res.status(400).send(error);
		});
});

// Endpoint to the tasks list in the database.
app.post("/tasks", (req, res) => {
	const task = new Task(req.body);

	task.save()
		.then(() => {
			res.send(task);
		})
		.catch((error) => {
			res.status(404).send(error);
		});
});

// The app starts the server and listens to port for incoming requests to routes.
app.listen(port, () => {
	console.log("Server is listening at port: " + port);
});
