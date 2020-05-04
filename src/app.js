// Loading all the dependencies
require("./db/mongoose");
const express = require("express");
const app = express();

// !if needed load the models of users and tasks

// Loading all routers
const userRouter = require("./routers/usersRouter");
const taskRouter = require("./routers/taskRouter");

const port = process.env.PORT || 3000;

// Parses the incoming requests using json.
app.use(express.json());

// Setting the required routers
app.use(userRouter);
app.use(taskRouter);

// The app starts the server and listens to port for incoming requests to routes.
app.listen(port, () => {
	console.log("Server is listening at port: " + port);
});
