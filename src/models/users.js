const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./tasks");
const userSchema = new mongoose.Schema(
	{
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
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("tasks", {
	ref: "Task",
	localField: "_id",
	foreignField: "owner",
});

userSchema.methods.toJSON = function () {
	const user = this;
	const publicProfile = user.toObject();

	delete publicProfile.password;
	delete publicProfile.tokens;
	delete publicProfile.avatar;

	return publicProfile;
};
// methods are accessible on instances
userSchema.methods.generateAuthToken = async function () {
	const token = jwt.sign(
		{ _id: this._id.toString() },
		"neededauthentication"
	);

	this.tokens = this.tokens.concat({ token });
	await this.save();
	return token;
};

// Static models are accessible on models
userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error("Unable to login");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	console.log(isMatch);
	if (!isMatch) {
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

// Delete user's task when user deletes an account

userSchema.pre("remove", async function (next) {
	await Task.deleteMany({ owner: this._id });
	// console.log("Here");
	next();
});
const User = mongoose.model("User", userSchema);

module.exports = User;
