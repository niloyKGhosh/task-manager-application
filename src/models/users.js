const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true, // doesn't save accounts with same email
		trim: true,
		lowercase: true,
		validate(value) {
			if (!validator.isEmail(value)) {
				throw new Error("Email is invalid");
			}
		},
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
		trim: true,
		validate(value) {
			if (value.toLowerCase().includes("password")) {
				throw new Error("Password cannot contain 'password'");
			}
		},
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if (value < 0) {
				throw new Error("Age must be a positive number");
			}
		},
	},
});

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to login");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	console.log(isMatch);
	if (!isMatch) {
		console.log("I am here");
		throw new Error("Unable to login");
	}

	return user;
};

userSchema.pre("save", async function (next) {
	// this refers to the user that is being saved
	// console.log(this);
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 8);
	}
	// next function tells when the function should stop.
	next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
