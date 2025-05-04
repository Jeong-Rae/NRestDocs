# 📘 NRestDocs

> Automatically generates API documentation from NodeJS + Supertest-based E2E tests.

Document: [English](./docs/en/README.md), [한국어](./docs/ko/README.md)
---

## Overview

API documentation for NestJS applications is typically managed via **Swagger (OpenAPI)**. While Swagger provides a convenient UI and intuitive syntax, it has notable limitations:

- **Code intrusion**: Swagger annotations clutter your production code.
- **Outdated documentation**: Documentation often drifts out of sync as APIs evolve, leading to inaccuracies.

**NRestDocs** solves these issues with a **test-driven documentation** approach:

- Completely separates documentation from production code.
- Generates accurate, up-to-date documentation directly from existing E2E tests.
- Immediately detects inconsistencies, causing tests to fail and ensuring accuracy.
- Eliminates separate maintenance of annotations and tests.

---

## 📦 Existing Swagger Approach (As‑Is)

Typical Swagger usage introduces annotations directly into production controllers:

```typescript
@ApiTags("users")
@Controller("users")
export class UserController {
    @ApiOperation({ summary: "Create User" })
    @ApiResponse({
        status: 201,
        description: "User successfully created",
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

- Mixing documentation annotations with business logic reduces readability and maintainability.
- Manual updates to Swagger annotations frequently result in documentation drift.
- No built-in mechanism to enforce documentation accuracy.

---

## 🚀 NRestDocs Approach (To‑Be)

NRestDocs integrates seamlessly with Jest & Supertest-based E2E tests, using a clear declarative syntax and factory-defined descriptors:

```typescript
await docRequest(
  request(app.getHttpServer())
    .post("/users/:userId")
    .set("Authorization", "Bearer <token>")
    .send({ name: "Jane Doe", age: 25 })
    .expect(201)
)
  .withPathParameters([definePath("userId")])
  .withRequestHeaders([defineHeader("Authorization").format("Bearer")])
  .withRequestFields([
    defineField("name"),
    defineField("age").type("number").description("Age of the user"),
  ])
  .withResponseCookie([
    defineHeader("Set-Cookie").format("base64").description("Session cookie").optional(),
  ])
  .withResponseFields([
    defineField("id").type("number")
    defineField("name").type("string")
  ])
  .doc("create-user");
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

- Keeps production code free of documentation annotations.
- Automatically synchronizes documentation with E2E tests.
- Fails immediately if documentation becomes inaccurate.
- Reduces maintenance by using tests as the single source of truth.

---

## 🔁 Before and After Comparison

| Comparison Item    | Swagger (Existing)                     | NRestDocs (Improved)                   |
| ------------------ | -------------------------------------- | -------------------------------------- |
| Code Intrusion     | Swagger annotations invade production code | No impact on production code        |
| Documentation Updates | Manual and error-prone              | Automatically synchronized via tests   |
| Accuracy Guarantee | No enforcement                         | Enforced by strict-mode testing       |
| Maintenance Cost   | High (docs and tests separately)       | Lower (tests serve as documentation)   |

---

## ✨ Key Features

- Seamless integration with Jest & Supertest
- Automatic generation of documentation for requests, responses, headers, cookies, parameters, and multipart parts
- Built-in cURL snippet generation
- Strict mode to enforce documentation accuracy
- Outputs documentation in AsciiDoc (Markdown & custom formats via OpenAPI compatibility layer planned)
- Declarative and intuitive chaining API

---

## 📚 How to Use

Chain methods on your Supertest request wrapped by `docRequest`:

```typescript
await docRequest(
  request(app.getHttpServer())
    .get("/path")
    .expect(200)
)
  .withRequestHeaders({ /* headers definition */ })
  .withRequestFields({ /* fields definition */ })
  .withQueryParameters({ /* query params definition */ })
  .withPathParameters({ /* path params definition */ })
  .withRequestParts({ /* multipart parts definition */ })
  .withResponseHeaders({ /* response headers definition */ })
  .withResponseFields({ /* response fields definition */ })
  .doc("api-identifier");
```

---

## 📝 Define Helpers

Use predefined helpers for clear descriptor definitions:

| Helper Factory | Default Type | Description                      |
| -------------- | ------------ | -------------------------------- |
| `definedHeaders()` | `"string"`   | Request/Response headers |
| `definedFields()`  | _required_   | Request/Response body fields |
| `definedQueryParams()` | `"string"` | URL query parameters      |
| `definedPathParams()` | `"string"` | URL path parameters       |
| `definedFormParams()` | `"string"` | Form parameters (application/x-www-form-urlencoded) |
| `definedParts()`      | `"file"`   | Multipart form-data parts |
| `definedCookies()`    | `"string"` | HTTP cookies              |

**Examples**

### definedHeaders

#### DSL
```ts
definedHeaders([
  defineHeader("Authorization").description("Bearer auth token"),
  defineHeader("X-Request-ID").description("Unique request identifier"),
]);

```

### Record
```ts
definedHeaders({
  Authorization: { description: "Bearer auth token" },
  "X-Request-ID": { description: "Unique request identifier" },
});
```

### Array
```ts
definedHeaders([
  { name: "Authorization", description: "Bearer auth token" },
  { name: "X-Request-ID", description: "Unique request identifier" },
]);
```

### definedHeaders

#### DSL
```ts
definedHeaders([
  defineHeader("Authorization").description("Bearer auth token"),
  defineHeader("X-Request-ID").description("Unique request identifier"),
]);

```

### Record
```ts
definedHeaders({
  Authorization: { description: "Bearer auth token" },
  "X-Request-ID": { description: "Unique request identifier" },
});
```

### Array
```ts
definedHeaders([
  { name: "Authorization", description: "Bearer auth token" },
  { name: "X-Request-ID", description: "Unique request identifier" },
]);
```

### definedHeaders

#### DSL
```ts
definedHeaders([
  defineHeader("Authorization").description("Bearer auth token"),
  defineHeader("X-Request-ID").description("Unique request identifier"),
]);

```

### Record
```ts
definedHeaders({
  Authorization: { description: "Bearer auth token" },
  "X-Request-ID": { description: "Unique request identifier" },
});
```

### Array
```ts
definedHeaders([
  { name: "Authorization", description: "Bearer auth token" },
  { name: "X-Request-ID", description: "Unique request identifier" },
]);
```

### definedFields

#### DSL
```ts
definedFields([
  defineField("user.name").type("string").description("User's full name"),
  defineField("user.age").type("number").description("User's age"),
]);
```

### Record
```ts
definedFields({
  "user.name": { type: "string", description: "User's full name" },
  "user.age": { type: "number", description: "User's age" },
});

```

### Array
```ts
definedFields([
  { name: "user.name", type: "string", description: "User's full name" },
  { name: "user.age", type: "number", description: "User's age" },
]);

```

### definedQueryParams

#### DSL
```ts
definedQueryParams([
  defineQuery("page").type("number").description("Page number"),
  defineQuery("limit").type("number").description("Items per page"),
]);


```

### Record
```ts
definedQueryParams({
  page: { type: "number", description: "Page number" },
  limit: { type: "number", description: "Items per page" },
});

```

### Array
```ts
definedQueryParams([
  { name: "page", type: "number", description: "Page number" },
  { name: "limit", type: "number", description: "Items per page" },
]);

```

### definedPathParams

#### DSL
```ts
definedPathParams([
  definePath("userId").type("string").format("uuid").description("User UUID"),
  definePath("postId").type("string").format("uuid").description("Post UUID"),
]);


```

### Record
```ts
definedPathParams({
  userId: { type: "string", format: "uuid", description: "User UUID" },
  postId: { type: "string", format: "uuid", description: "Post UUID" },
});

```

### Array
```ts
definedPathParams([
  { name: "userId", type: "string", format: "uuid", description: "User UUID" },
  { name: "postId", type: "string", format: "uuid", description: "Post UUID" },
]);

```

### definedFormParams

#### DSL
```ts
definedFormParams([
  defineForm("username").type("string").description("User login name"),
  defineForm("password").type("string").description("User password"),
]);


```

### Record
```ts
definedFormParams({
  username: { type: "string", description: "User login name" },
  password: { type: "string", description: "User password" },
});

```

### Array
```ts
definedFormParams([
  { name: "username", type: "string", description: "User login name" },
  { name: "password", type: "string", description: "User password" },
]);

```

### definedParts

#### DSL
```ts
definedParts([
  definePart("file").type("string").format("binary").description("Uploaded file"),
  definePart("metadata").type("object").description("Metadata for the file"),
]);


```

### Record
```ts
definedParts({
  file: { type: "string", format: "binary", description: "Uploaded file" },
  metadata: { type: "object", description: "Metadata for the file" },
});

```

### Array
```ts
definedParts([
  { name: "file", type: "string", format: "binary", description: "Uploaded file" },
  { name: "metadata", type: "object", description: "Metadata for the file" },
]);

```

### definedCookies

#### DSL
```ts
definedCookies([
  defineCookie("sessionId").type("string").description("Session ID cookie"),
  defineCookie("preferences").type("string").description("User preferences cookie"),
]);


```

### Record
```ts
definedCookies({
  sessionId: { type: "string", description: "Session ID cookie" },
  preferences: { type: "string", description: "User preferences cookie" },
});

```

### Array
```ts
definedCookies([
  { name: "sessionId", type: "string", description: "Session ID cookie" },
  { name: "preferences", type: "string", description: "User preferences cookie" },
]);

```

---

## 📌 Comprehensive Example

A realistic multipart E2E test example documenting a file upload endpoint:

```typescript
await docRequest(
  request(app.getHttpServer())
    .post("/users/:userId/avatar?replace=true")
    .set("Authorization", "Bearer <token>")
    .field("description", "Profile picture")
    .attach("avatar", "./test/avatar.png")
    .expect(200)
)
  .withRequestHeaders([
    defineHeader("Authorization").description("Bearer authentication token"),
  ])
  .withPathParameters([
    definePath("userId").format("uuid").description("User identifier"),
  ])
  .withQueryParameters([
    defineQuery("replace").type("boolean").description("Replace existing avatar?").optional(),
  ])
  .withRequestParts([
    definePart("avatar").format("binary").description("Avatar image file"),
  ])
  .withRequestPartFields(
    "description", [ defineField("text").type("string").description("Image description") ]
  )
  .withResponseHeaders([
    defineHeader("Set-Cookie").description("Session cookie").optional(),
  ])
  .withResponseFields([
    defineField("success").type("boolean").description("Operation success status"),
    defineField("url").format("uri").description("Uploaded avatar URL"),
  ])
  .doc("update-user-avatar");

```

### If use Nest-Swagger
```ts
class UploadAvatarResponseDto {
  @ApiProperty({ type: 'boolean', description: 'Operation success status' })
  success: boolean;

  @ApiProperty({ type: 'string', format: 'uri', description: 'Uploaded avatar URL' })
  url: string;
}

class UploadAvatarDescriptionDto {
  @ApiProperty({ type: 'string', description: 'Image description' })
  text: string;
}

@Controller('users')
export class UsersController {
  @Post(':userId/avatar')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({
    name: 'userId',
    type: 'string',
    format: 'uuid',
    description: 'User identifier',
  })
  @ApiQuery({
    name: 'replace',
    type: 'boolean',
    required: false,
    description: 'Replace existing avatar?',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer authentication token',
    required: true,
  })
  @ApiHeader({
    name: 'Set-Cookie',
    description: 'Session cookie',
    required: false,
  })
  @ApiBody({
    description: 'Avatar upload payload',
    type: UploadAvatarDescriptionDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Avatar upload success response',
    type: UploadAvatarResponseDto,
  })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('userId') userId: string,
    @Query('replace') replace: boolean,
    @UploadedFile() avatar: Express.Multer.File,
    @Body() description: UploadAvatarDescriptionDto,
    @Headers('Authorization') authorization: string,
  ): Promise<UploadAvatarResponseDto> {
    return {
      success: true,
      url: 'https://example.com/avatar.png',
    };
  }
}
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
 