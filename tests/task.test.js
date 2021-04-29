const app = require("../src/app");
const request = require("supertest");
const Task = require("../src/models/task");
const {
  setupDatabase,
  userOne,
  userOneId,
  userTwo,
  userTwoId,
  taskOne,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("should create task for user", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "from my test",
    })
    .expect(201);
  const task = await Task.findById(response.body._id);
  expect(task).not.toBeNull();
  expect(task.completed).toEqual(false);
});

test("Should get all task for userOne", async () => {
  const response = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(2);
});

test("should not delete Task for other user", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);
  const task = Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
