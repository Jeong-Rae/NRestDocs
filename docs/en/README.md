# 📘 NRestDocs

> A documentation tool that automatically generates API documentation from NestJS + Supertest-based E2E tests

Document: [English](../en/README.md), [한국어](../ko/README.md)

---

## Overview

API documentation for NestJS applications is typically managed via **Swagger (OpenAPI)**. While Swagger provides a convenient UI and intuitive syntax, it has the following drawbacks:

- **Code intrusion**: To use Swagger you must add annotations to your production code, mixing documentation code with business logic.
- **Outdated documentation**: If the API evolves and you forget to update your Swagger comments, the docs no longer match the implementation—leading to confusion and increased maintenance costs.

**NRestDocs** solves these issues with a **test‑based documentation** approach:

- Completely separates documentation from production code, minimizing complexity.
- Automatically generates up‑to‑date docs from your existing E2E tests.
- Fails tests immediately if docs and API responses drift out of sync, guaranteeing accuracy.
- Eliminates the need to maintain Swagger annotations and tests separately, reducing overhead.

---

## 📦 Existing Swagger Approach (As‑Is)

Here’s an example showing Swagger annotations invading production code:

```typescript
// user.controller.ts
@ApiTags("users")
@Controller("users")
export class UserController {
    @ApiOperation({ summary: "Create User" })
    @ApiResponse({
        status: 201,
        description: "Returns the created user",
        type: User,
        headers: {
            "Set-Cookie": {
                description: "Session cookie",
                schema: { type: "string" },
            },
        },
    })
    @Post()
    create(@Body() createUserDto: CreateUserDto): User {
        return this.userService.create(createUserDto);
    }
}
```

### ⚠️ Issues

- Business logic and documentation code are mixed.
- Swagger comments can easily become outdated when the API changes.
- No built‑in mechanism ensures docs stay current and accurate.

---

## 🚀 NRestDocs Approach (To‑Be)

With NRestDocs, you write your E2E tests as usual, and the documentation is automatically generated—completely separated from production code:

```typescript
// user.controller.e2e-spec.ts
describe("UserController (e2e)", () => {
    it("POST /users - Create User", async () => {
        await docRequest(
            request(app.getHttpServer())
                .post("/users")
                .set("Authorization", "Bearer <token>")
                .send({ name: "John Doe", age: 30 })
                .expect(201)
        )
            .withDescription("User creation API")
            .withRequestHeaders([
                defineHeader("Authorization")
                    .type("string")
                    .description("Bearer token authentication"),
            ])
            .withRequestFields([
                defineField("name").type("string").description("User name"),
                defineField("age").type("number").description("User age"),
            ])
            .withResponseHeaders([
                defineHeader("Set-Cookie")
                    .type("string")
                    .description("Session cookie")
                    .optional(),
            ])
            .withResponseFields([
                defineField("id").type("number").description("Created user ID"),
                defineField("name")
                    .type("string")
                    .description("Created user name"),
            ])
            .doc("create-user");
    });
});
```

### 🗂 Generated Documentation Structure Example

```
docs/create-user/
├── curl-request.adoc
├── http-request.adoc
├── http-response.adoc
├── request-headers.adoc
├── request-fields.adoc
├── response-headers.adoc
└── response-fields.adoc
```

### ✅ Advantages of NRestDocs

- Keeps production code clean.
- Guarantees up‑to‑date docs by tying them to E2E tests.
- Strict mode fails tests on any mismatch between API and docs.
- Eliminates dual maintenance of Swagger annotations and tests.

---

## 🔁 Before and After Comparison

| Comparison Item    | Swagger (Existing)                     | NRestDocs (Improved)                |
| ------------------ | -------------------------------------- | ----------------------------------- |
| Code Intrusion     | Swagger annotations in production code | No impact on production code        |
| Doc Updates        | Manual, error‑prone                    | Auto‑synced with tests              |
| Accuracy Guarantee | No enforcement                         | Strict mode ensures accuracy        |
| Maintenance Cost   | High (docs + tests separately)         | Efficient single‑source maintenance |

---

## ✨ Key Features

- Seamless Jest & Supertest E2E integration
- Automatic doc of HTTP requests/responses, headers, parameters, fields
- Includes cURL snippets
- Strict mode for guaranteed accuracy
- Outputs AsciiDoc by default (Markdown upcoming)
- Declarative, chainable API

---

## 📚 How to Use

All methods can be chained. Basic structure:

```typescript
await docRequest(
  request(app.getHttpServer())
    .get('/path')
    .expect(200)
)
  .withDescription('API description')
  .withRequestHeaders([...])
  .withRequestFields([...])
  .withRequestParameters([...])
  .withPathParameters([...])
  .withRequestParts([...])
  .withResponseHeaders([...])
  .withResponseFields([...])
  .doc('api-identifier');
```

---

## 📖 Detailed Method Definitions

### 1️⃣ `withDescription`

| Parameter | Required | Description         |
| --------- | -------- | ------------------- |
| desc      | ✅       | The API description |

**Example**

```typescript
.withDescription('User creation API')
```

---

### 2️⃣ `withRequestHeaders`

| Field         | Required                 | Type    | Description           |
| ------------- | ------------------------ | ------- | --------------------- |
| `name`        | ✅                       | string  | Header name           |
| `type`        | ❌ (default: `"string"`) | string  | Header type           |
| `description` | ❌                       | string  | Header description    |
| `optional`    | ❌ (default: `false`)    | boolean | Whether it’s optional |

**Example**

```typescript
.withRequestHeaders([
  defineHeader('Authorization')
    .description('Bearer auth token'),
  { name: 'X-Request-ID', description: 'Request trace ID', optional: true },
])
```

---

### 3️⃣ `withResponseHeaders`

Same signature as `withRequestHeaders`.

```typescript
.withResponseHeaders([
  defineHeader('Set-Cookie').description('Session cookie'),
])
```

---

### 4️⃣ `withRequestFields` / `withResponseFields`

| Field         | Required              | Type    | Description       |
| ------------- | --------------------- | ------- | ----------------- |
| `name`        | ✅                    | string  | Field name        |
| `type`        | ✅                    | string  | Field type        |
| `description` | ❌                    | string  | Field description |
| `optional`    | ❌ (default: `false`) | boolean | Optional flag     |

**Example**

```typescript
.withRequestFields([
  defineField('name')
    .type('string')
    .description('User name'),
  defineField('age')
    .type('number')
    .description('User age')
    .optional(),
])
```

---

### 5️⃣ `withRequestParameters`

For URL query parameters, same structure as headers/fields.

```typescript
.withRequestParameters([
  defineQueryParam('search').description('Search keyword'),
  { name: 'page', description: 'Page number', optional: true },
])
```

---

### 6️⃣ `withPathParameters`

For dynamic URL segments, same structure:

```typescript
.withPathParameters([
  definePathParam('userId').description('User ID'),
])
```

---

### 7️⃣ `withRequestParts`

For multipart requests (file uploads):

| Field         | Required               | Type    | Description      |
| ------------- | ---------------------- | ------- | ---------------- |
| `name`        | ✅                     | string  | Part name        |
| `type`        | ❌ (default: `"file"`) | string  | Part type        |
| `description` | ❌                     | string  | Part description |
| `optional`    | ❌ (default: `false`)  | boolean | Optional flag    |

**Example**

```typescript
.withRequestParts([
  { name: 'avatar', description: 'User avatar image' },
  definePart('metadata')
    .type('json')
    .description('Additional data')
    .optional(),
])
```

---

### 8️⃣ `doc`

Writes the snippet files.  
| Argument | Required | Description |
| ----------- | -------- | ---------------------------------------- |
| identifier | ✅ | Unique API identifier (e.g., `'create-user'`) |

```typescript
.doc('create-user')
```

---

### 9️⃣ `withServers`

Sets OpenAPI server URLs.

| Argument  | Required | Description          |
| --------- | -------- | -------------------- |
| `servers` | ✅       | Array of server URLs |

```typescript
.withServers([
  'http://api.example.com',
  'http://api2.example.com'
])
```

---

### 🔟 `withOperation`

Specifies HTTP method and path.

| Argument | Required | Description  |
| -------- | -------- | ------------ |
| method   | ✅       | HTTP method  |
| path     | ✅       | API endpoint |

```typescript
.withOperation('POST', '/api/users')
```

---

### 1️⃣1️⃣ `withResponse`

Defines response details per status code.

| Argument   | Required | Description          |
| ---------- | -------- | -------------------- |
| statusCode | ✅       | HTTP status code     |
| response   | ✅       | Response info object |

Response object structure:

| Field         | Required | Type   | Description      |
| ------------- | -------- | ------ | ---------------- |
| `headers`     | ❌       | array  | Response headers |
| `fields`      | ❌       | array  | Response fields  |
| `description` | ❌       | string | Description      |

**Examples**

With fields:

```typescript
.withResponse(201, {
  description: 'Resource created successfully',
  headers: [
    defineHeader('Location').description('Location of the new resource')
  ],
  fields: [
    defineField('id').type('number').description('New resource ID'),
    defineField('createdAt').type('string').description('Creation timestamp')
  ]
})
```

Without fields:

```typescript
.withResponse(204, {
  description: 'Resource deleted successfully'
})
```

Multiple status codes:

```typescript
.withResponse(200, {
  description: 'Success',
  fields: [defineField('result').type('object').description('Result data')]
})
.withResponse(400, {
  description: 'Bad request',
  fields: [defineField('error').type('string').description('Error message')]
})
.withResponse(500, {
  description: 'Server error',
  fields: [defineField('message').type('string').description('Error details')]
})
```

---

## 📝 Define Helpers

Helper functions to declaratively build definitions:

| Function                 | Default Type | Description                      |
| ------------------------ | ------------ | -------------------------------- |
| `defineHeader(name)`     | `"string"`   | Defines a header                 |
| `defineField(name)`      | _required_   | Defines a request/response field |
| `defineQueryParam(name)` | `"string"`   | Defines a query parameter        |
| `definePathParam(name)`  | `"string"`   | Defines a path parameter         |
| `definePart(name)`       | `"file"`     | Defines a multipart part         |

**Examples**

```typescript
defineHeader("Authorization").description("Auth header");

defineField("age").type("number").description("User age");

defineQueryParam("keyword").description("Search keyword").optional();

definePathParam("userId").description("User ID");

definePart("image").description("Profile image").optional();
```

---

## 📌 Comprehensive Example

```typescript
await docRequest(
    request(app.getHttpServer())
        .post("/users/:userId/avatar?replace=true")
        .set("Authorization", "Bearer token")
        .field("description", "Profile image")
        .attach("avatar", "./test/avatar.png")
        .expect(200)
)
    .withDescription("User avatar update")
    .withRequestHeaders([
        defineHeader("Authorization").description("Bearer auth token"),
    ])
    .withPathParameters([definePathParam("userId").description("User ID")])
    .withRequestParameters([
        defineQueryParam("replace")
            .description("Replace existing image")
            .optional(),
    ])
    .withRequestParts([
        definePart("avatar").description("Avatar image file"),
        definePart("description")
            .type("string")
            .description("Image description")
            .optional(),
    ])
    .withResponseHeaders([
        defineHeader("Set-Cookie").description("Session cookie").optional(),
    ])
    .withResponseFields([
        defineField("success").type("boolean").description("Operation status"),
        defineField("url").type("string").description("Uploaded image URL"),
    ])
    .doc("update-user-avatar");
```

---

## 📥 Installation

```bash
npm install --save-dev nrestdocs
# or with yarn
yarn add --dev nrestdocs
```

---

## ⚙️ Configuration

Create `nrestdocs.config.ts` in your project root:

```typescript
// nrestdocs.config.ts
import { defineConfig } from "nrestdocs";

export default defineConfig({
    output: "./docs",
    format: "adoc", // or 'md'
    strict: true, // fails tests on any doc/API mismatch
});
```

---

## 🧩 Documentation Integration Guide

Include the generated snippets to assemble a single document:

```asciidoc
= User API Documentation

== Create User API

=== Request
include::create-user/curl-request.adoc[]
include::create-user/request-headers.adoc[]
include::create-user/request-fields.adoc[]

=== Response
include::create-user/http-response.adoc[]
include::create-user/response-headers.adoc[]
include::create-user/response-fields.adoc[]
```

---

## 🧱 Development Environment Support & Extensibility

- Native AsciiDoc support (Markdown coming soon)
- Extensible via custom renderers and writers
- Consolidates tests and docs into a single workflow

---

## 🛣 Upcoming Features

- Support for HTML, PDF, Notion and other formats
- OpenAPI/Swagger compatibility layer

---

## 🤝 Contribution

This project is open source and welcomes contributions! Bug reports, feature requests, and PRs are all appreciated.

- Open an issue at [GitHub Issues](https://github.com/Jeong-Rae/NRestDocs)
- Base your PR on the `main` branch

---

## 📄 License

Distributed under the MIT License.

```text
Copyright (c) Jeong-Rae
```
