// Loading all the dependencies
require("./db/mongoose");
const express = require("express");
const app = express();

// Loading all the models
const User = require("./models/users");
const Task = require("./models/tasks");

const userRouter = require("./routers/usersRouter");
const port = process.env.PORT || 3000;

// Parses the incoming requests using json.
app.use(express.json());
app.use(userRouter);

app.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send();
	}
});

app.get("/tasks/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findById(_id);
		if (!task) {
			return res.status(404).send("No task found!");
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

app.patch("/tasks/:id", async (req, res) => {
	// TODO: send http data as a json for req.body
	// TODO: new: true sends the new user

	const updates = Object.keys(req.body);
	const possibleUpdates = ["heading", "description", "completed"];
	const isValidOperation = updates.every((update) =>
		possibleUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send("Invalid update option");
	}

	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!task) {
			return res.status(404).send("Task Not Found");
		}
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

app.delete("/tasks/:id", async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			res.status(404).send("Task Not Found to delete");
		}

		res.send(task);
	} catch (e) {
		res, status(500).send(e);
	}
});
// The app starts the server and listens to port for incoming requests to routes.
app.listen(port, () => {
	console.log("Server is listening at port: " + port);
});
