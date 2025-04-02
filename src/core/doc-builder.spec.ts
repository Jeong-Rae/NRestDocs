import { Response } from "supertest";
import { describe, expect, it } from "vitest";

import { DocRequestBuilder, docRequest } from "./doc-builder";

// supertest Response 모의 객체 생성
const mockResponsePromise = Promise.resolve({} as Response);

describe("doc-builder", () => {
    describe("docRequest", () => {
        it("supertest Promise를 받아 DocRequestBuilder 인스턴스를 반환해야 한다", () => {
            // Given
            const supertestPromise = mockResponsePromise;

            // When
            const builder = docRequest(supertestPromise);

            // Then
            expect(builder).toBeInstanceOf(DocRequestBuilder);
        });
    });
});
