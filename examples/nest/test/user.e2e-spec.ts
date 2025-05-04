import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { defineField, definePath, docRequest } from "@nrestdocs/core";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("UsersController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("POST /users", async () => {
        const userName = "Test User";

        await docRequest(
            request(app.getHttpServer())
                .post("/users")
                .send({ name: userName })
                .expect(201)
                .expect(({ body }) => {
                    expect(body).toHaveProperty("id");
                    expect(body).toHaveProperty("name");
                })
        )
            .setRequestPath("/users")
            .withRequestFields([defineField("name").type("string").description("Name of the user")])
            .withResponseFields([
                defineField("id").type("number").description("ID of the user"),
                defineField("name").type("string").description("Name of the user"),
            ])
            .doc("users-create");
    });

    it("GET /users/:id", async () => {
        const userId = 1;

        await docRequest(
            request(app.getHttpServer())
                .get(`/users/${userId}`)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toHaveProperty("id", userId);
                    expect(body).toHaveProperty("name");
                })
        )
            .setRequestPath("/users/:id")
            .withPathParameters([definePath("id").type("number").description("User ID")])
            .withResponseFields([
                defineField("id").type("number").description("ID of the user"),
                defineField("name").type("string").description("Name of the user"),
            ])
            .doc("users-retrieve");
    });

    it("GET /users/:id/settings", async () => {
        const userId = 1;

        await docRequest(
            request(app.getHttpServer())
                .get(`/users/${userId}/settings`)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toHaveProperty("userId", userId);
                    expect(body).toHaveProperty("theme");
                    expect(body).toHaveProperty("notifications");
                })
        )
            .setRequestPath("/users/:id/settings")
            .withPathParameters([definePath("id").type("number").description("User ID")])
            .withResponseFields([
                defineField("userId").type("number").description("User ID"),
                defineField("theme").type("string").description("Theme preference"),
                defineField("notifications").type("boolean").description("Notification setting"),
            ])
            .doc("users-settings");
    });

    it("PUT /users/:id/profile", async () => {
        const userId = 1;
        const profileData = { email: "test@example.com" };

        await docRequest(
            request(app.getHttpServer())
                .put(`/users/${userId}/profile`)
                .send(profileData)
                .expect(200)
                .expect(({ body }) => {
                    expect(body).toHaveProperty("userId", userId);
                    expect(body).toHaveProperty("message", "Profile updated successfully");
                    expect(body.profile).toEqual(profileData);
                })
        )
            .setRequestPath("/users/:id/profile")
            .withPathParameters([definePath("id").type("number").description("User ID")])
            .withRequestFields([
                defineField("email").type("string").description("User email address"),
            ])
            .withResponseFields([
                defineField("userId").type("number").description("User ID"),
                defineField("message").type("string").description("Result message"),
                defineField("profile").type("object").description("Updated profile info"),
            ])
            .doc("users-update-profile");
    });
});
