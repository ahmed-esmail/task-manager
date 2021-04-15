const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should sign up anew user", async () => {
  const response = await request(app)
    .post("/users")
    .send({
      name: "ahmed",
      email: "ahmed.esmail@gmail.com",
      password: "ahmed.esmail",
    })
    .expect(201);

  // Assert that database was changed correctly
  const user = await User.findById(response.body.user._id);
  expect(user).not.toBeNull();

  // Assertion about response
  expect(response.body).toMatchObject({
    user: {
      name: "ahmed",
      email: "ahmed.esmail@gmail.com",
    },
    token: user.tokens[0].token,
  });

  // Assert about password
  expect(user.password).not.toBe("ahmed.esmail");
});

test("should user sign in ", async () => {
  const response = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(response.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user ", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: `${userOne.email}sd`,
      password: `${userOne.password}dsa`,
    })
    .expect(400);
});

test("should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("should't get profile for unauthenticated user", async () => {
  await request(app).get("/users/me").send().expect(401);
});

test("should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("should't delete account for unauthenticated user", async () => {
  await request(app).delete("/users/me").send().expect(401);
});

test("should upload avatar");
