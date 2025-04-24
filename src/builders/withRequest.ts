import { isEmpty } from "es-toolkit/compat";
import type { FieldDescriptor, HeaderDescriptor, PartDescriptor } from "../types";
import type { OpenAPI_V3_1 } from "../types/open-api-spec";
import { type PartialWithName, normalizeDescriptors } from "../utils/normalize-descriptors";
import type { DescriptorBuilder } from "./descriptor-builder";

export function applyRequestHeaders(
    headers: (DescriptorBuilder<HeaderDescriptor> | PartialWithName<HeaderDescriptor>)[]
): HeaderDescriptor[] {
    return normalizeDescriptors(headers);
}

export function applyRequestParts(
    parts: (DescriptorBuilder<PartDescriptor> | PartDescriptor)[]
): PartDescriptor[] {
    return normalizeDescriptors(parts);
}

export function applyRequestFields(
    fields: (DescriptorBuilder<FieldDescriptor> | FieldDescriptor)[]
): FieldDescriptor[] {
    return normalizeDescriptors(fields);
}

/**
 * FieldDescriptor[] → JSON 객체 스키마
 */
export function renderRequestFieldSchema(fields: FieldDescriptor[]): OpenAPI_V3_1.Schema {
    const properties: Record<string, OpenAPI_V3_1.Schema> = {};
    const required: string[] = [];

    fields.forEach((f) => {
        properties[f.name] = { type: f.type } as OpenAPI_V3_1.Schema;
        if (!f.optional) {
            required.push(f.name);
        }
    });

    return {
        type: "object",
        properties,
        ...(!isEmpty(required) ? { required } : {}),
    };
}

/**
 * PartDescriptor[] → multipart/form-data용 스키마/인코딩 정보
 *   - 스키마: 모든 part가 object로 묶일 수 있게 object 타입
 *   - encoding: 각 part별 contentType(파일/텍스트 등) 설정
 */
export function renderRequestPartSchema(parts: PartDescriptor[]): {
    schema: OpenAPI_V3_1.Schema;
    encoding: Record<string, OpenAPI_V3_1.Encoding>;
} {
    const encoding: Record<string, OpenAPI_V3_1.Encoding> = {};

    parts.forEach((p) => {
        encoding[p.name] = {
            // PartDescriptor.type에 mime type을 담도록 가정
            contentType: p.type,
            headers: {}, // 필요 시 HeaderDescriptor 적용
            style: "form",
            explode: false,
            allowReserved: false,
        };
    });

    const schema: OpenAPI_V3_1.Schema = {
        type: "object",
        properties: parts.reduce<Record<string, OpenAPI_V3_1.Schema>>((acc, p) => {
            acc[p.name] = { type: "string" };
            return acc;
        }, {}),
        required: parts.filter((p) => !p.optional).map((p) => p.name),
    };

    return { schema, encoding };
}

/**
 * fields, parts 데이터를 합쳐서 RequestBody 생성
 */
export function renderRequestBody(
    mediaType: string,
    fields?: FieldDescriptor[],
    parts?: PartDescriptor[]
): OpenAPI_V3_1.RequestBody | undefined {
    if (isEmpty(fields) && isEmpty(parts)) {
        return undefined;
    }

    // multipart/form-data
    if (mediaType.startsWith("multipart/")) {
        const { schema, encoding } = renderRequestPartSchema(parts || []);

        return {
            content: {
                [mediaType]: {
                    schema,
                    encoding,
                },
            },
            required: true,
        };
    }

    // application/json or default
    const schema = renderRequestFieldSchema(fields || []);

    return {
        content: {
            [mediaType]: { schema },
        },
        required: Object.values(schema.properties || {}).length > 0,
    };
}
