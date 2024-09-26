import request from "supertest";
import app from "../app";

const key = "TestKey";
const value = "TestValue";
const ttl = 30;

describe("StoreManager Tests", () => {
  afterEach(() => {
    (app as any).stack = [];
  });

  it("should return 404 when deleting a key that doesnt exist", async () => {
    const response = await request(app).delete(`/storeManager/noKey`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Key not found");
  });

  it("should return a 400 if key or value is missing", async () => {
    const response = await request(app).post("/storeManager").send({ key });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Key and value are required");
  });

  it("should add a key value pair", async () => {
    const response = await request(app)
      .post("/storeManager")
      .send({ key, value, ttl });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Key '${key}' added`);
  });

  it("should get a value by key", async () => {
    await request(app).post("/storeManager").send({ key, value, ttl });

    const response = await request(app).get(`/storeManager/${key}`);

    expect(response.status).toBe(200);
    expect(response.body.value).toBe(value);
  });

  it("should return 404 when getting a key that doesnt exist", async () => {
    const response = await request(app).get(`/storeManager/NonExistentKey`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Key not found or expired");
  });

  it("should delete a key", async () => {
    await request(app).post("/storeManager").send({ key, value, ttl });

    const response = await request(app).delete(`/storeManager/${key}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(`Key '${key}' deleted`);
  });
});
