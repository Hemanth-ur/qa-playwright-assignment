import { test, expect } from "@playwright/test";
import 'dotenv/config';

const BASE_URL = "https://reqres.in/api";

const headers = {
  "x-api-key": process.env.REQRES_API_KEY!,
  "Content-Type": "application/json",
};

interface ReqresUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface ListUsersResponse {
  data: ReqresUser[];
}

interface CreateUserResponse {
  name: string;
  job: string;
  id: string;
  createdAt: string;
}

test.describe("Reqres API Tests", () => {

  test("GET users returns valid user data", async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/users?page=2`,
      { headers }
    );
  
    expect(response.status()).toBe(200);

    const body = await response.json() as ListUsersResponse;

    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBeTruthy();
    expect(body.data.length).toBeGreaterThan(0);

    for (const user of body.data) {

      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("first_name");
      expect(user).toHaveProperty("last_name");

    }

  });

  test("POST users creates a new user", async ({ request }) => {

    const payload = {
      name: "morpheus",
      job: "leader",
    };

    const response = await request.post(
      `${BASE_URL}/users`,
      {
        headers,
        data: payload,
      }
    );

    expect(response.status()).toBe(201);

    const body = await response.json() as CreateUserResponse;

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();

  });

  test("BONUS - create then verify response", async ({ request }) => {

    const payload = {
      name: "neo",
      job: "the one",
    };

    const response = await request.post(
      `${BASE_URL}/users`,
      {
        headers,
        data: payload,
      }
    );

    expect(response.status()).toBe(201);

    const body = await response.json() as CreateUserResponse;

    expect(body).toMatchObject({
      name: payload.name,
      job: payload.job,
    });

    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();

  });

});