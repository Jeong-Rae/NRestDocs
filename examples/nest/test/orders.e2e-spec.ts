import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";

describe("OrdersController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it("/orders (POST)", () => {
        const productData = { productId: 1, qty: 1 };
        return request(app.getHttpServer())
            .post("/orders")
            .send(productData)
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty("orderId");
                expect(res.body.productId).toEqual(productData.productId);
                expect(res.body.qty).toEqual(productData.qty);
            });
    });

    it("/orders/:id (GET)", () => {
        const orderId = 123;
        return request(app.getHttpServer())
            .get(`/orders/${orderId}`)
            .expect(200)
            .expect({ orderId: orderId, productId: 1, qty: 2, status: "pending" });
    });

    it("/orders/:id (DELETE)", () => {
        const orderId = 456;
        return request(app.getHttpServer())
            .delete(`/orders/${orderId}`)
            .expect(200)
            .expect({ orderId: orderId, message: "Order deleted successfully" });
    });

    afterAll(async () => {
        await app.close();
    });
});
