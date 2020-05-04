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

// Endpoint to create the users list in the database.
app.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

// Endpoint to create the tasks list in the database.
app.post("/tasks", async (req, res) => {
	const task = new Task(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(500).send(e);
	}
});

// Get all the users stored in the database.
app.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send();
	}
});

// Get a specific user by a specific id by route parameters indicated by :id
app.get("/users/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const user = await User.findById(_id);
		if (!user) {
			return res.status(404).send("No users found!");
		}
		res.send(user);
	} catch (e) {
		res.status(500).send();
	}
});

// Updates a specific id by route parameters
app.patch("/users/:id", async (req, res) => {
	// TODO: send http data as a json for req.body
	// TODO: new: true sends the new user

	const updates = Object.keys(req.body);
	const possibleUpdates = ["name", "email", "password", "age"];
	const isValidOperation = updates.every((update) =>
		possibleUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send("Invalid update option!");
	}

	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!user) {
			return res.status(404).send("No users found!");
		}

		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

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
// The app starts the server and listens to port for incoming requests to routes.
app.listen(port, () => {
	console.log("Server is listening at port: " + port);
});
