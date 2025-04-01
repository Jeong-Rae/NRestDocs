# 📘 NRestDocs

> NestJS + Jest 기반의 E2E 테스트로부터 API 문서를 자동 생성하는 문서화 도구

---

## 📖 개요

**NRestDocs**는 Spring REST Docs에서 영감을 얻어 설계된 **NestJS용 RESTful API 문서화 라이브러리**입니다.  
기존의 NestJS와 Jest를 활용한 E2E 테스트에 통합되어, 테스트 실행과 동시에 **API 문서를 자동으로 생성**합니다.

이제 NestJS 애플리케이션의 **신뢰할 수 있는 최신 API 문서**를 항상 최신 상태로 유지할 수 있습니다.

---

## 🚀 주요 기능

- **Jest & Supertest 기반 E2E 테스트**와 완벽하게 통합
- 요청과 응답의 모든 요소를 상세하게 문서화 지원
    - HTTP 요청/응답 (cURL 명령어 포함)
    - 요청/응답 헤더
    - 경로/쿼리 파라미터
    - 멀티파트(Multipart) 데이터
    - 요청/응답 JSON 필드
- **엄격한(strict) 모드 지원**: 문서화된 스펙과 실제 요청/응답을 비교하여 불일치 발견 시 테스트 실패
- 기본적으로 **AsciiDoc 문서 생성** 지원 (Markdown 확장 가능)
- 선언적이고 간결한 API 문법 제공

---

## 📦 설치 방법

```shell
npm install --save-dev nrestdocs
# 또는 yarn
yarn add --dev nrestdocs
```

---

## ✨ 사용법

### ✅ 기본 예시 코드 (E2E 테스트 기반 문서화)

**`app.e2e-spec.ts`**

```typescript
import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { docRequest, definedField, definedHeader } from "nrestdocs";

describe("UserController (e2e)", () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it("POST /users - 사용자 생성", async () => {
        await docRequest(
            request(app.getHttpServer())
                .post("/users")
                .set("Authorization", "Basic <credentials>")
                .send({ name: "lyght", age: 25 })
                .expect(201)
        )
            .withDescription("사용자 생성 API")
            .withRequestHeaders([
                definedHeader("Authorization")
                    .type("string")
                    .description("인증키 Basic <credentials> 형태")
                    .optional(),
            ])
            .withRequestFields([
                definedField("name").type("string").description("사용자 이름"),
                definedField("age").type("number").description("사용자 나이"),
            ])
            .withResponseFields([
                definedField("id").type("number").description("생성된 사용자 ID"),
                definedField("name").type("string").description("생성된 사용자 이름"),
            ])
            .doc("create-user");
    });
});
```

위 테스트를 실행하면 다음과 같은 구조로 문서 스니펫이 자동으로 생성됩니다:

```shell
docs/
  └── create-user/
      ├── curl-request.adoc
      ├── http-request.adoc
      ├── http-response.adoc
      ├── request-headers.adoc
      ├── request-fields.adoc
      └── response-fields.adoc
```

---

### ✅ 생성된 스니펫 예시 (`request-fields.adoc`)

```asciidoc
= request-fields

== Request Fields
[cols="3,2,2,7", options="header"]
|===
| Field | Type | Optional | Description

| `name` | `string` | `false` | 사용자 이름
| `age` | `number` | `false` | 사용자 나이
|===
```

---

## ⚙️ 설정 방법

`nrestdocs.config.ts` 파일을 프로젝트 루트에 생성하여 다음과 같이 설정합니다:

```typescript
// nrestdocs.config.ts
import { defineConfig } from "nrestdocs";

export default defineConfig({
    output: "./docs",
    format: "adoc", // or 'md'
    strict: true, // 문서와 실제 요청/응답이 다를 시 테스트 실패
});
```

---

## 📚 문서 통합 가이드

NRestDocs로 생성된 스니펫을 `include`를 사용하여 하나의 문서로 통합할 수 있습니다.

### ✅ 예시 (`index.adoc`):

```asciidoc
= 사용자 API 문서

== 사용자 생성 API

include::create-user/overview.adoc[]

=== 요청 예시
include::create-user/curl-request.adoc[]
include::create-user/http-request.adoc[]
include::create-user/request-headers.adoc[]
include::create-user/request-fields.adoc[]

=== 응답 예시
include::create-user/http-response.adoc[]
include::create-user/response-fields.adoc[]
```

---

## 🔧 개발환경 지원 및 확장성

- 기본 AsciiDoc 지원 (Markdown 추가 지원 예정)
- 쉽게 확장 가능한 Renderer 및 Writer 인터페이스 제공
- E2E 테스트와 문서화를 하나의 코드로 관리 가능

---

## 📌 향후 지원 예정 기능

- HTML, PDF, Notion 등 추가 포맷 지원
- 문서화 Dashboard 지원
- OpenAPI와의 통합 지원 (Swagger 연동)

---

## 🙌 기여 방법 (Contribution)

이 프로젝트는 오픈소스이며 여러분의 기여를 환영합니다. 버그 리포트, 기능 요청, PR 모두 언제나 환영합니다!

- 버그나 개선사항은 [GitHub 이슈](https://github.com/Jeong-Rae/NRestDocs/issues)에 등록해주세요.
- PR을 보내실 때는 main 브랜치를 기반으로 작성해주세요.

---

## 📃 License

본 프로젝트는 **MIT 라이선스**로 배포됩니다.

```text
Copyright (c) Jeong-Rae
```
