const express = require("express");
const User = require("../models/users");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();

router.post("/users", async (req, res) => {
	const user = new User(req.body);

	try {
		await user.save();
		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

/**
 * Endpoint to allow users to login
 */
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);

		const token = await user.generateAuthToken();
		// console.log(user);
		res.send({ user, token });
	} catch (e) {
		console.log(e);
		res.status(400).send("Unable to login!");
	}
});

router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);

		await req.user.save();

		res.send({ message: "Logged Out of Session!" });
	} catch (e) {
		res.status(500).send("Unable to logout of session!");
	}
});

router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
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
		updates.forEach((update) => {
			req.user[update] = req.body[update];
		});

		await req.user.save();

		res.send(req.user);
	} catch (e) {
		res.status(400).send(e);
	}
});

router.delete("/users/me", auth, async (req, res) => {
	try {
		// pre method defined when deleting user
		await req.user.remove();
		res.send(req.user);
	} catch (e) {
		return res.status(500).send(e);
	}
});
const upload = multer({
	dest: "avatars",
});
router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
	res.send("Ok");
});

module.exports = router;
