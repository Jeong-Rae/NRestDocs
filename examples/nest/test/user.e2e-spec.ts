import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";

describe("Users API (e2e)", () => {
    let app: INestApplication<App>;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });
    afterAll(async () => await app.close());

    it("POST /users", async () => {
        const userName = "Test User";
        return request(app.getHttpServer())
            .post("/users")
            .send({ name: userName })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty("id");
                expect(res.body.name).toEqual(userName);
            });
    });

    it("GET /users/:id", async () => {
        const userId = 1;
        return request(app.getHttpServer())
            .get(`/users/${userId}`)
            .expect(200)
            .expect({ id: userId, name: "홍길동" });
    });

    it("GET /users/:id/settings", async () => {
        const userId = 1;
        return request(app.getHttpServer())
            .get(`/users/${userId}/settings`)
            .expect(200)
            .expect({ userId: userId, theme: "dark", notifications: true });
    });

    it("PUT /users/:id/profile", async () => {
        const userId = 1;
        const profileData = { email: "test@example.com" };
        return request(app.getHttpServer())
            .put(`/users/${userId}/profile`)
            .send(profileData)
            .expect(200)
            .expect({
                userId: userId,
                message: "Profile updated successfully",
                profile: profileData,
            });
    });
});
