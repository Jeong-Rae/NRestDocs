import type { BaseDescriptor, FieldType, ParamKind } from "./types";

/** 빌더 상태 태그 타입 */
const BuilderState = {
    Unset: "TYPE_UNSET",
    Set: "TYPE_SET",
} as const;

type TypeUnset = { __state: typeof BuilderState.Unset };
type TypeSet = { __state: typeof BuilderState.Set };

/** 공통 Builder 인터페이스 */
export interface Builder<D extends Partial<BaseDescriptor>, S> {
    // type 호출을 required 하므로, Omit으로 안전한 정의가 필요
    type<T extends FieldType>(type: T): Builder<Omit<D, "type"> & { type: T }, TypeSet>;

    description(description: string): Builder<D & { description: string }, S>;

    // optinal일때 값이 true만 가능하므로, 타입적으로 보장
    optional(): Builder<D & { optional: true }, S>;

    build(this: Builder<D & BaseDescriptor, TypeSet>): Readonly<D & BaseDescriptor>;
}

/** 빌더 생성 함수 */
export function createBuilder<K extends ParamKind, N extends string>(
    kind: K,
    name: N,
    draft: Partial<BaseDescriptor<K>> & { kind: K; name: N } = { kind, name }
): Builder<Partial<BaseDescriptor> & { kind: K; name: N }, TypeUnset> {
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
        build(this: Builder<typeof draft & BaseDescriptor<K>, TypeSet>) {
            return draft as Readonly<typeof draft & BaseDescriptor<K>>;
        },
    };
    return arg as Builder<Partial<BaseDescriptor> & { kind: K; name: N }, TypeUnset>;
}
