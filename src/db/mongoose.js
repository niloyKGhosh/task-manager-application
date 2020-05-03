const mongoose = require("mongoose");

const dbUrl = "mongodb://127.0.0.1:27017/task-manager-api";

mongoose.connect(dbUrl, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
