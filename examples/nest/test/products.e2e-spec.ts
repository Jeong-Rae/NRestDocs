import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
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

    it("/products (POST)", () => {
        const productData = { name: "Test Product", price: 50 };
        return request(app.getHttpServer())
            .post("/products")
            .send(productData)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty("id");
                expect(res.body.name).toEqual(productData.name);
                expect(res.body.price).toEqual(productData.price);
            });
    });

    it("/products (GET)", () => {
        return request(app.getHttpServer())
            .get("/products")
            .expect(200)
            .expect([
                { id: 1, name: "Product A", price: 100 },
                { id: 2, name: "Product B", price: 200 },
            ]);
    });

    afterAll(async () => {
        await app.close();
    });
});
