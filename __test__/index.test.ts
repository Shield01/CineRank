import request from "supertest";
import app from "../src/app";

describe("Visit Base Url", () => {
  it("should return status of 200", async () => {
    const res = await request(app).get(`/`);

    expect(res.status).toBe(200);
  });

  it("should return correct welcoming string", async () => {
    let res = await request(app).get(`/`);

    expect(res.body).toStrictEqual({
      message: "Welcome to Montech-MyTop100Movies API",
    });
  });
});
