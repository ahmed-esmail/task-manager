const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");

const userOne = {
  name: "mohamed",
  email: "mohamed.esmail@gmail.com",
  password: "mohamed.esmail",
};

beforeEach(async () => {
  await User.deleteMany();
  await new User(userOne).save();
});

test("should sign up ", async () => {
  await request(app)
    .post("/users")
    .send({
      name: "ahmed",
      email: "ahmed.esmail@gmail.com",
      password: "ahmed.esmail",
    })
    .expect(201);
});

test("should user sign in ", async () => {
  await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
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
