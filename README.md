# NRestDocs

> NestJS + Jest 기반의 E2E 테스트로부터 API 문서를 자동 생성하는 문서화 도구

---

## 개요

NestJS 애플리케이션의 API 문서화는 일반적으로 **Swagger(OpenAPI)**를 통해 관리됩니다. Swagger는 편리한 UI와 직관적인 문법을 제공하지만, 다음과 같은 문제점이 있습니다.

- **코드 침투 문제**: Swagger를 사용하기 위해 프로덕션 코드에 Swagger 어노테이션을 추가해야 합니다. 이는 비즈니스 로직과 API 문서화 코드가 뒤섞이는 문제를 발생시킵니다.
- **문서 최신화 문제**: API가 변경되었을 때 Swagger 문서 주석을 업데이트하지 않으면 실제 API와 문서가 일치하지 않게 됩니다. 이는 팀의 혼란과 운영 비용 증가로 이어질 수 있습니다.

**NRestDocs**는 이 문제를 **테스트 기반 문서화** 방식으로 해결합니다.

- 프로덕션 코드와 완벽히 분리된 문서화 방식으로 코드의 복잡성을 최소화합니다.
- 이미 작성해야 하는 E2E 테스트를 기반으로 자동으로 문서가 생성되어 항상 최신 상태의 문서를 유지할 수 있습니다.
- 문서와 실제 API가 불일치하면 즉시 테스트가 실패하여, 정확성을 보장합니다.
- 결국 Swagger 문서화와 E2E 테스트를 별도로 작성하는 이중의 비용을 제거하고 효율적으로 관리할 수 있습니다.

---

## 기존 Swagger 방식 (As-Is)

다음은 프로덕션 코드에 Swagger 어노테이션이 침투한 예시입니다.

```typescript
// user.controller.ts
@ApiTags("users")
@Controller("users")
export class UserController {
    @ApiOperation({ summary: "사용자 생성" })
    @ApiResponse({
        status: 201,
        description: "생성된 사용자 반환",
        type: User,
        headers: {
            "Set-Cookie": {
                description: "세션 쿠키",
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

### 문제점

- API 명세를 위한 코드와 비즈니스 로직이 혼재됩니다.
- API가 변경되었을 때 Swagger 주석이 누락될 위험이 있습니다.
- 문서의 최신성과 정확성을 보장하는 장치가 없습니다.

---

## NRestDocs 방식 (To-Be)

NRestDocs를 적용하면, 프로덕션 코드와 완전히 분리된 E2E 테스트에서 문서를 자동 생성할 수 있습니다.

```typescript
// user.controller.e2e-spec.ts
describe("UserController (e2e)", () => {
    it("POST /users - 사용자 생성", async () => {
        await docRequest(
            request(app.getHttpServer())
                .post("/users")
                .set("Authorization", "Bearer <token>")
                .send({ name: "홍길동", age: 30 })
                .expect(201)
        )
            .withDescription("사용자 생성 API")
            .withRequestHeaders([
                definedHeader("Authorization").type("string").description("Bearer 토큰 인증"),
            ])
            .withRequestFields([
                definedField("name").type("string").description("사용자 이름"),
                definedField("age").type("number").description("사용자 나이"),
            ])
            .withResponseHeaders([
                definedHeader("Set-Cookie").type("string").description("세션 쿠키").optional(),
            ])
            .withResponseFields([
                definedField("id").type("number").description("생성된 사용자 ID"),
                definedField("name").type("string").description("생성된 사용자 이름"),
            ])
            .doc("create-user");
    });
});
```

### 생성된 문서 구조 예시

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

### NRestDocs의 장점

- 프로덕션 코드를 깨끗하게 유지할 수 있습니다.
- API 변경 시 E2E 테스트도 필수로 변경해야 하므로, 문서 최신화를 자동 보장합니다.
- Strict 모드를 통해 실제 API 응답과 문서 간 불일치가 있으면 즉각적으로 탐지하여 테스트를 실패시킵니다.
- E2E 테스트 코드를 작성하며 문서까지 관리하므로, Swagger와 E2E 테스트를 별도로 관리할 필요가 없어 비용을 효율적으로 관리할 수 있습니다.

---

## NRestDocs 도입 전후 비교

| 비교 항목     | Swagger (기존 방식)                         | NRestDocs (개선된 방식)              |
| ------------- | ------------------------------------------- | ------------------------------------ |
| 코드 침투     | 프로덕션 코드에 Swagger 어노테이션 추가     | 프로덕션 코드 영향 없음              |
| 문서 최신화   | 수동 업데이트로 최신성 보장 어려움          | 테스트와 동기화되어 자동 최신화 유지 |
| 정확성 보장   | 문서와 API 불일치 가능성 존재               | Strict 모드로 정확성 자동 보장       |
| 유지보수 비용 | 문서, 테스트 이중 관리로 유지보수 비용 높음 | 테스트 하나로 문서 자동 관리         |

---

## 주요 기능

- Jest & Supertest E2E 테스트와 완벽한 통합
- HTTP 요청/응답, 헤더, 파라미터, 필드 문서화 지원
- cURL 명령어를 포함한 상세한 요청 문서 자동 생성
- 엄격한(strict) 모드 지원으로 정확성 보장
- 기본적으로 AsciiDoc 문서 생성 (Markdown 확장 가능)
- 선언적이고 간결한 API 제공

---

## 설치 방법

```shell
npm install --save-dev nrestdocs
# 또는 yarn
yarn add --dev nrestdocs
```

---

## 설정 방법

`nrestdocs.config.ts`를 프로젝트 루트에 생성합니다:

```typescript
// nrestdocs.config.ts
import { defineConfig } from "nrestdocs";

export default defineConfig({
    output: "./docs",
    format: "adoc", // or 'md'
    strict: true, // 문서와 요청/응답 불일치 시 테스트 실패
});
```

---

## 문서 통합 가이드

생성된 스니펫을 `include`하여 하나의 문서로 통합할 수 있습니다:

```asciidoc
= 사용자 API 문서

== 사용자 생성 API

=== 요청
include::create-user/curl-request.adoc[]
include::create-user/request-headers.adoc[]
include::create-user/request-fields.adoc[]

=== 응답
include::create-user/http-response.adoc[]
include::create-user/response-headers.adoc[]
include::create-user/response-fields.adoc[]
```

---

## 개발환경 지원 및 확장성

- 기본 AsciiDoc 지원 (Markdown 추가 예정)
- Renderer 및 Writer를 통한 확장 가능
- 테스트와 문서화를 단일 코드로 관리

---

## 향후 지원 예정 기능

- HTML, PDF, Notion 등 추가 포맷 지원
- OpenAPI 통합 지원 (Swagger와의 호환성 지원)

---

## 기여 방법 (Contribution)

이 프로젝트는 오픈소스이며 모든 분들의 기여를 환영합니다. 버그 리포트, 기능 요청, PR 등 언제나 환영합니다!

- [GitHub 이슈](https://github.com/Jeong-Rae/NRestDocs/issues)에 버그 또는 개선사항을 등록해주세요.
- PR은 main 브랜치를 기반으로 작성해주세요.

---

## 라이선스 (License)

본 프로젝트는 MIT 라이선스로 배포됩니다.

```text
Copyright (c) Jeong-Rae
```
