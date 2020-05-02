const mongoose = require("mongoose");

const Task = mongoose.model("Task", {
	heading: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	completed: {
		type: Boolean,
		default: false,
	},
});
module.exports = Task;
