export function exampleRouteTestTemplate(): string {
  return `import request from "supertest";
import app from "../src/app";

describe("Example API", () => {
  let createdId: number;

  it("should return empty array initially on GET /api/examples", async () => {
    const res = await request(app).get("/api/examples");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should create an example on POST /api/examples", async () => {
    const res = await request(app)
      .post("/api/examples")
      .send({ name: "Test", description: "A test example" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe("Test");
    createdId = res.body.id;
  });

  it("should return 400 for invalid POST body", async () => {
    const res = await request(app)
      .post("/api/examples")
      .send({ name: "" });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should update an example on PUT /api/examples/:id", async () => {
    const res = await request(app)
      .put(\`/api/examples/\${createdId}\`)
      .send({ name: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Updated");
  });

  it("should return 404 for non-existent PUT", async () => {
    const res = await request(app)
      .put("/api/examples/9999")
      .send({ name: "Nope" });
    expect(res.status).toBe(404);
  });

  it("should delete an example on DELETE /api/examples/:id", async () => {
    const res = await request(app).delete(\`/api/examples/\${createdId}\`);
    expect(res.status).toBe(204);
  });

  it("should return 404 for non-existent DELETE", async () => {
    const res = await request(app).delete("/api/examples/9999");
    expect(res.status).toBe(404);
  });
});
`;
}
