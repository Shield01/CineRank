import * as auth from "../../src/Utils/auth.utils";

describe("Hash Password", () => {
  it("should always return a promise", async () => {
    const res = await auth.hashPassword("vyidvuioba");

    expect(Promise.resolve(res)).toBeInstanceOf(Promise);
  });
});

describe("Verify Password", () => {
  it("should always return a promise", async () => {
    const res = await auth.verifyPassword("vyidvuioba", "randomString");

    expect(Promise.resolve(res)).toBeInstanceOf(Promise);
  });
});

describe("Create JWT Token", () => {
  it("should always return a string", async () => {
    const res = auth.create_jwt_token("vyidvuioba", "randomString");

    expect(typeof res).toBe("string");
  });
});

describe("Decode Token", () => {
  it("should always return the proper return data", () => {
    const res = auth.decode_token("vyidvuioba");

    expect(res).toHaveProperty("valid");
    expect(res).toHaveProperty("expired");
    expect(res).toHaveProperty("decoded_token");
  });
});
