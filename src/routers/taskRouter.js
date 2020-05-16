const express = require("express");
const Task = require("../models/tasks");
const router = new express.Router();
const auth = require("../middleware/auth");
// Endpoint to create the tasks list in the database.
router.post("/tasks", auth, async (req, res) => {
	const task = new Task({
		...req.body,
		owner: req.user._id,
	});

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(500).send(e);
	}
});

router.get("/tasks", auth, async (req, res) => {
	const match = {};
	const sort = {};

	if (req.query.completed) {
		match.completed = req.query.completed === "true";
	}

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":");
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
	}
	try {
		// const tasks = await Task.find({ owner: req.user._id });
		await req.user
			.populate({
				path: "tasks",
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.send(req.user.tasks);
	} catch (e) {
		res.status(500).send();
	}
});

router.get("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id; // task id
	try {
		// Authenticates user and finds matches the id sent and onwer id stored in the Task Schema
		const task = await Task.findOne({ _id, owner: req.user._id });

		if (!task) {
			return res.status(404).send("No task found!");
		}
		res.send(task);
	} catch (e) {
		res.status(500).send();
	}
});

router.patch("/tasks/:id", auth, async (req, res) => {
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
		// const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });

		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).send("Task Not Found");
		}

		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();
		res.send(task);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/tasks/:id", auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).send("Task Not Found to delete");
		}

		res.send(task);
	} catch (e) {
		res, status(500).send(e);
	}
});

module.exports = router;
