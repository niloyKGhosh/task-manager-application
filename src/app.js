// Loading all the dependencies
const express = require("express");
const app = express();
require("./db/mongoose");

// Loading all the models
const User = require("./models/users");

const user = new User({
	name: "Niloy",
	email: "niloykumar256@gmail.com",
	password: "hulalala3456",
	age: "29",
});
