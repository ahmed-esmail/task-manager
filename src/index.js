const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");

const app = express();
const port = process.env.PORT || 3000;

// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET requests are disabled')
//     } else {
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.status(503).send('Site is currently down. Check back soon!')
// })

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

const Task = require("./models/task");
const User = require("./models/user");

const main = async () => {
  //   const task = await User.findById("60511b6eea46215a505bec49");
  //   await task.populate("owner").execPopulate();
  //   console.log(task);
  const user = await User.findById("60511710f98bb15ed00cf168");
  await user.populate("tasks").execPopulate();
  user.populate("");
  console.log(user.tasks);
};

main();
