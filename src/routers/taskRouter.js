const express = require("express");
const Task = require("../models/tasks");
const router = new express.Router();

router.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find({});
		res.send(tasks);
	} catch (e) {
		res.status(500).send();
	}
});

router.get("/tasks/:id", async (req, res) => {
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

router.patch("/tasks/:id", async (req, res) => {
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

router.delete("/tasks/:id", async (req, res) => {
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

module.exports = router;
