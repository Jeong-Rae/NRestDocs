// test/orders.e2e-spec.ts
import type { INestApplication } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import { defineCookie, defineField, defineHeader, definePath, docRequest } from "@nrestdocs/core";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("OrdersController (e2e)", () => {
    let app: INestApplication;

    beforeEach(async () => {
        const mod: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = mod.createNestApplication();
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });

    it("/orders (POST)", async () => {
        const productData = { productId: 1, qty: 1 };

        await docRequest(
            request(app.getHttpServer())
                .post("/orders")
                .set("Content-Type", "application/json")
                .set("Authorization", "Bearer test-token")
                .set("Cookie", "sessionId=abc123")
                .send(productData)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty("orderId");
                    expect(res.body.productId).toEqual(productData.productId);
                    expect(res.body.qty).toEqual(productData.qty);
                })
        )
            .setRequestPath("/orders")
            .withRequestHeaders([
                defineHeader("Content-Type").description("Request body media type"),
                defineHeader("Authorization").description("Bearer authentication token"),
            ])
            .withResponseHeaders([
                defineHeader("Set-Cookie").description("Session cookie"),
                defineHeader("Location").optional().description("Created resource URI"),
            ])
            .withRequestCookies([defineCookie("sessionId").description("Session identifier")])
            .withResponseCookies([
                defineCookie("order_session").description("Order session cookie").optional(),
            ])
            .withRequestFields([
                defineField("productId").type("number").description("ID of the product"),
                defineField("qty").type("number").description("Quantity ordered"),
            ])
            .withResponseFields([
                defineField("orderId").type("number").description("ID of the order"),
                defineField("productId").type("number").description("ID of the product"),
                defineField("qty").type("number").description("Quantity ordered"),
                defineField("status").type("string").description("Order status"),
            ])
            .doc("orders-create");
    });

    it("/orders/:id (GET)", async () => {
        const orderId = 123;

        await docRequest(
            request(app.getHttpServer())
                .get(`/orders/${orderId}`)
                .set("Accept", "application/json")
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty("orderId");
                    expect(res.body.productId).toBeDefined();
                    expect(res.body.qty).toBeDefined();
                })
        )
            .setRequestPath("/orders/:id")
            .withPathParameters([definePath("id").type("number").description("Order identifier")])
            .withRequestHeaders([
                defineHeader("Accept").description("Expected media type (application/json)"),
            ])
            .withResponseHeaders([
                defineHeader("Cache-Control").optional().description("Caching policy"),
            ])
            .withResponseCookies([
                defineCookie("order_session").optional().description("Order session cookie"),
            ])
            .withResponseFields([
                defineField("orderId").type("number"),
                defineField("productId").type("number"),
                defineField("qty").type("number"),
                defineField("status").type("string"),
            ])
            .doc("orders-retrieve");
    });

    it("/orders/:id (DELETE)", async () => {
        const orderId = 456;

        await docRequest(
            request(app.getHttpServer())
                .delete(`/orders/${orderId}`)
                .set("Authorization", "Bearer test-token")
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty("orderId");
                    expect(res.body.message).toEqual("Order deleted successfully");
                })
        )
            .setRequestPath("/orders/:id")
            .withPathParameters([definePath("id").type("number").description("Order identifier")])
            .withRequestHeaders([
                defineHeader("Authorization").description("Bearer authentication token"),
            ])
            .withResponseHeaders([
                defineHeader("Set-Cookie").optional().description("Clear session cookie"),
            ])
            .withResponseCookies([
                defineCookie("order_session").optional().description("Order session cleared"),
            ])
            .withResponseFields([
                defineField("orderId").type("number"),
                defineField("message").type("string").description("Deletion result message"),
            ])
            .doc("orders-delete");
    });
});
