import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { defineField, docRequest } from "@nrestdocs/core";
import request from "supertest";
import { AppModule } from "./../src/app.module";

describe("ProductsController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/products (POST)", async () => {
        const productData = { name: "Test Product", price: 50 };
        await docRequest(
            request(app.getHttpServer())
                .post("/products")
                .send(productData)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty("id");
                    expect(res.body).toHaveProperty("name");
                    expect(res.body).toHaveProperty("price");
                })
        )
            .setRequestPath("/products")
            .withRequestFields([
                defineField("name").type("string").description("Name of the product"),
                defineField("price").type("number").description("Price of the product"),
            ])
            .withResponseFields([
                defineField("id").type("number").description("ID of the product"),
                defineField("name").type("string").description("Name of the product"),
                defineField("price").type("number").description("Price of the product"),
            ])
            .doc("products-create");
    });

    it("/products (GET)", async () => {
        await docRequest(
            request(app.getHttpServer())
                .get("/products")
                .expect(200)
                .expect(({ body }) => {
                    expect(Array.isArray(body)).toBe(true);
                    expect(body.length).toBeGreaterThan(0);
                    expect(body[0]).toHaveProperty("id");
                    expect(body[0]).toHaveProperty("name");
                    expect(body[0]).toHaveProperty("price");
                })
        )
            .setRequestPath("/products")
            .withResponseFields([
                defineField("id").type("number").description("ID of the product"),
                defineField("name").type("string").description("Name of the product"),
                defineField("price").type("number").description("Price of the product"),
            ])
            .doc("products-list");
    });

    afterAll(async () => {
        await app.close();
    });
});
