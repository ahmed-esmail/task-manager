const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { setupDatabase, userOne, userOneId } = require("./fixtures/db");

beforeEach(setupDatabase);

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

test("should upload avatar", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/Annotation 2020-11-05 202949.png")
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("should update user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "ahmed" })
    .expect(200);
  const user = await User.findById(userOneId);
  expect(user.name).toBe("ahmed");
});

test("should not update invalid user field", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ role: "ahmed" })
    .expect(400);
});
