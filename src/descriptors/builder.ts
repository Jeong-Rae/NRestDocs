import type { BaseDescriptor, FieldType, ParamKind } from "./types";

/** 빌더 상태 태그 타입 */
export const BuilderState = {
    Unset: "TYPE_UNSET",
    Set: "TYPE_SET",
} as const;

export type TypeUnset = { __state: typeof BuilderState.Unset };
export type TypeSet = { __state: typeof BuilderState.Set };

/** 공통 Builder 인터페이스 */
export interface Builder<D extends Partial<BaseDescriptor<K>>, S, K extends ParamKind> {
    // type 호출을 required 하므로, Omit으로 안전한 정의가 필요
    type<T extends FieldType>(type: T): Builder<Omit<D, "type"> & { type: T }, TypeSet, K>;

    description(description: string): Builder<D & { description: string }, S, K>;

    // optinal일때 값이 true만 가능하므로, 타입적으로 보장
    optional(): Builder<D & { optional: true }, S, K>;

    build(this: Builder<D & BaseDescriptor<K>, TypeSet, K>): Readonly<D & BaseDescriptor<K>>;
}

/** 빌더 생성 함수 */
export function createBuilder<K extends ParamKind, N extends string>(
    kind: K,
    name: N,
    draft: Partial<BaseDescriptor<K>> & { kind: K; name: N } = { kind, name }
): Builder<typeof draft, TypeUnset, K> {
    const arg: unknown = {
        type(t: FieldType) {
            return createBuilder(kind, name, { ...draft, type: t });
        },
        description(description: string) {
            return createBuilder(kind, name, { ...draft, description });
        },
        optional() {
            return createBuilder(kind, name, { ...draft, optional: true });
        },
        build(
            this: Builder<typeof draft & BaseDescriptor<K>, TypeSet, K>
        ): Readonly<typeof draft & BaseDescriptor<K>> {
            return draft as Readonly<typeof draft & BaseDescriptor<K>>;
        },
    };
    return arg as Builder<typeof draft, TypeUnset, K>;
}
