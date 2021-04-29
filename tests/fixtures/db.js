const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: "mohamed",
  email: "mohamed.esmail@gmail.com",
  password: "mohamed.esmail",
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
    },
  ],
};

const userTwoId = mongoose.Types.ObjectId();
const userTwo = {
  _id: userTwoId,
  name: "ahmed2",
  email: "ahmed2.esmail@gmail.com",
  password: "ahmed2.esmail",
  tokens: [
    {
      token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: mongoose.Types.ObjectId(),
  description: "first Task",
  completed: false,
  owner: userOne._id,
};

const taskTwo = {
  _id: mongoose.Types.ObjectId(),
  description: "second Task",
  completed: false,
  owner: userOne._id,
};

const taskThree = {
  _id: mongoose.Types.ObjectId(),
  description: "Third Task",
  completed: true,
  owner: userTwo._id,
};

setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();

  await new User(userOne).save();
  await new User(userTwo).save();

  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  setupDatabase,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
  taskTwo,
  taskThree,
};
