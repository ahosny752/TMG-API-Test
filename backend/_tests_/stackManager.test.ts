import request from "supertest";
import app from "../app";

const item = "Test Item";

describe("StackManager Tests", () => {
  afterEach(() => {
    (app as any).stack = [];
  });

  it("should return a 404 when getting from a stack thats empty", async () => {
    const response = await request(app).get("/stackManager");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Stack is empty");
  });

  it("should add an item to the stack", async () => {
    const response = await request(app).post("/stackManager").send({ item });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Item '${item}' added to stack`);
  });

  it("should get the top item from the stack", async () => {
    await request(app).post("/stackManager").send({ item: "First Item" });
    await request(app).post("/stackManager").send({ item: "Second Item" });

    const response = await request(app).get("/stackManager");
    expect(response.status).toBe(200);
    expect(response.body.item).toBe("Second Item");
  });
});
