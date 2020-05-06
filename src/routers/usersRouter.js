const express = require("express");
const User = require("../models/users");
const router = new express.Router();

// Endpoint to create the users list in the database.
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

// Endpoint to create the tasks list in the database.
router.post("/tasks", async (req, res) => {
	const task = new Task(req.body);

	try {
		await task.save();
		res.status(201).send(task);
	} catch (e) {
		res.status(500).send(e);
	}
});

// Get all the users stored in the database.
router.get("/users", async (req, res) => {
	try {
		const users = await User.find({});
		res.send(users);
	} catch (e) {
		res.status(500).send();
	}
});

// Get a specific user by a specific id by route parameters indicated by :id
router.get("/users/:id", async (req, res) => {
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
router.patch("/users/:id", async (req, res) => {
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
		const user = await User.findById(req.params.id, req.body);

		updates.forEach((update) => {
			user[update] = req.body[update];
		});
		// const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		// 	new: true,
		// 	runValidators: true,
		// });

		if (!user) {
			return res.status(404).send("No users found!");
		}

		res.send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/users/:id", async (req, res) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);

		if (!user) {
			return res.status(404).send("No users found to delete!");
		}

		res.send(user);
	} catch (e) {
		return res.status(500).send(e);
	}
});

module.exports = router;
