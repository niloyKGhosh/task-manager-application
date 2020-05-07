const User = require("../models/users");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, "neededauthentication");
		// console.log(decoded);
		const user = await User.findOne({
			_id: decoded._id,
			"tokens.token": token,
		});

		// console.log(user);

		if (!user) {
			throw new Error();
		}

		req.user = user;
	} catch (e) {
		res.status(401).send({ error: "Authentication Denied!", e });
	}
	next();
};

module.exports = auth;
