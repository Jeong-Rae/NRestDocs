import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";

import { definePathParam, docRequest } from "@nrestdocs/core";

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
        const dto = { name: "Alice" };
        await docRequest(request(app.getHttpServer()).post("/users").send(dto).expect(201))
            .withDescription("Create user")
            .withPathParameters([
                definePathParam("userId").type("string").description("User ID"),
                { name: "postId", type: "string", description: "Post ID" },
            ])
            .doc("users-create");
    });
});
